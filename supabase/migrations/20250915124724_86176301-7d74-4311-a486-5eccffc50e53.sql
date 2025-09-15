-- Create RLS policies to allow system functions to work
CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can create activity logs" ON public.activity_logs
FOR INSERT WITH CHECK (true);

-- Create trigger for service request notifications
DROP TRIGGER IF EXISTS trigger_notify_service_request_created ON public.service_requests;
CREATE TRIGGER trigger_notify_service_request_created
  AFTER INSERT ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_service_request_created();