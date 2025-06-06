# apps/egg_candling/models.py

from django.db import models

class FertileEggCandling(models.Model):
    batch_id     = models.CharField(max_length=50)
    candling_date= models.DateField()
    count        = models.PositiveIntegerField()
    notes        = models.TextField(blank=True)

    def __str__(self):
        return f"Fertile – {self.batch_id} on {self.candling_date}"

class ClearEggCandling(models.Model):
    batch_id     = models.CharField(max_length=50)
    candling_date= models.DateField()
    count        = models.PositiveIntegerField()
    notes        = models.TextField(blank=True)

    def __str__(self):
        return f"Clear – {self.batch_id} on {self.candling_date}"
