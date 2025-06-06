# apps/incubation/models.py

from django.db import models

class Incubator(models.Model):
    name         = models.CharField(max_length=100)
    location     = models.CharField(max_length=100, blank=True)
    capacity      = models.PositiveIntegerField()
    description  = models.TextField(blank=True)

    def __str__(self):
        return self.name

class IncubationBatch(models.Model):
    batch_id           = models.CharField(max_length=50)
    incubator          = models.ForeignKey(
                             Incubator,
                             on_delete=models.CASCADE,
                             related_name='batches'
                         )
    start_date         = models.DateField()
    expected_hatch_date= models.DateField()
    quantity           = models.PositiveIntegerField()
    breed              = models.CharField(max_length=100)
    location           = models.CharField(max_length=100, blank=True)
    progress           = models.DecimalField(max_digits=5, decimal_places=2)
    status             = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.batch_id} in {self.incubator.name}"
