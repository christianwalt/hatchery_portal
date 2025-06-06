from django.db import models

class EggCollection(models.Model):
    farmer_name       = models.CharField(max_length=255)
    label             = models.CharField(max_length=50)
    animal_type       = models.CharField(max_length=50)
    type_of_eggs      = models.CharField(max_length=50)
    full_trays        = models.PositiveIntegerField()
    unfull_trays      = models.PositiveIntegerField()
    unfull_tray_count = models.PositiveIntegerField()
    damaged_eggs      = models.PositiveIntegerField()
    date              = models.DateField()

    def __str__(self):
        return f"{self.farmer_name} — {self.label}"
