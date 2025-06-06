# apps/lockdown/models.py

from django.db import models

class LockdownBatch(models.Model):
    batch_id          = models.CharField(max_length=50)
    label             = models.CharField(max_length=100)
    start_date        = models.DateField()
    lockdown_date     = models.DateField()
    quantity          = models.PositiveIntegerField()
    incubator_id      = models.CharField(max_length=50)
    transferred_to    = models.CharField(max_length=50)
    humidity          = models.DecimalField(max_digits=5, decimal_places=2)
    temperature       = models.DecimalField(max_digits=5, decimal_places=2)
    notification_sent = models.BooleanField(default=False)
    notes             = models.TextField(blank=True)
    day               = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.batch_id} @ Day {self.day}"
