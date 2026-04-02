class NotificationAgent:
    """
    NotificationAgent simulates sending emails/alerts to students for 
    upcoming deadlines or low attendance.
    """
    def __init__(self):
        pass

    def send_alert(self, user_id: int, message: str, alert_type: str = "general"):
        """
        Simulates sending a notification.
        In a real app, this would use an email service (SendGrid, SNS) or WebSockets.
        """
        print(f"🔔 [NOTIFICATION: {alert_type}] To DefaultUser_{user_id}: {message}")
        return {"status": "sent", "type": alert_type, "message": message}
