# apps/alerts/models.py

from django.db import models  # Base ORM layer

class Alert(models.Model):
    type       = models.CharField(max_length=50)            # Short string for alert category
    severity   = models.CharField(max_length=20)            # e.g., low, medium, high
    source     = models.CharField(max_length=100)           # Origin of alert
    value      = models.CharField(max_length=100)           # Measured value (e.g., "38.5°C")
    threshold  = models.CharField(max_length=100)           # Alert threshold (e.g., "38.0°C")
    timestamp  = models.DateTimeField()                     # Exact time of alert
    message    = models.TextField(blank=True)               # Detailed message
    status     = models.CharField(
                   max_length=20,
                   choices=[
                     ('active', 'Active'),
                     ('resolved', 'Resolved'),
                     ('acknowledged', 'Acknowledged')
                   ]
                 )                                       # Current alert status
    duration   = models.CharField(max_length=50, blank=True) # e.g., "2h 15m"
    resolution = models.TextField(blank=True)               # Resolution notes

    def __str__(self):
        return f"{self.type} ({self.severity}) at {self.timestamp}"
