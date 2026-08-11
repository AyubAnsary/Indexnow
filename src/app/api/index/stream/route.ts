import { subscribeToJobUpdates, getAllJobs } from '@/lib/job-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      // Send initial connection ACK
      const initData = `data: ${JSON.stringify({ type: 'connected', jobs: getAllJobs() })}\n\n`;
      controller.enqueue(encoder.encode(initData));

      // Subscribe to store updates
      const unsubscribe = subscribeToJobUpdates((job) => {
        try {
          const eventData = `data: ${JSON.stringify({ type: 'job_update', job })}\n\n`;
          controller.enqueue(encoder.encode(eventData));
        } catch (e) {
          console.error('SSE enqueue error:', e);
        }
      });

      // Keep connection alive with periodic heartbeats
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 15000);

      // Cleanup on client close
      return () => {
        clearInterval(interval);
        unsubscribe();
      };
    },
  });

  return new Response(customStream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
