# apps/hatching/models.py

from django.db import models

class HatchingRecord(models.Model):
    batch_id        = models.CharField(max_length=50)
    label           = models.CharField(max_length=100)
    hatch_date      = models.DateField()
    quantity        = models.PositiveIntegerField()
    hatched_eggs    = models.PositiveIntegerField()
    unhatched_eggs  = models.PositiveIntegerField()
    cull_chicks     = models.PositiveIntegerField()
    dead_chicks     = models.PositiveIntegerField()
    status          = models.CharField(max_length=20)
    notes           = models.TextField(blank=True)

    def __str__(self):
        return f"{self.batch_id} ({self.status})"
