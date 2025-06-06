from django.db import models
from apps.hatching.models import HatchingRecord

class PackagingBatch(models.Model):
    batch_id         = models.CharField(max_length=50)
    label            = models.CharField(max_length=100)
    packaging_date   = models.DateField()
    hatch_batch      = models.ForeignKey(                           
                         HatchingRecord,
                         on_delete=models.CASCADE,
                         related_name='packaging_batches'
                       )
    type_of_chicks   = models.CharField(max_length=50)
    box_type         = models.CharField(max_length=50)
    full_boxes       = models.PositiveIntegerField()  
    unfull_boxes     = models.PositiveIntegerField()  
    unfull_box_count = models.PositiveIntegerField()  
    chicks_packed    = models.PositiveIntegerField()  
    status           = models.CharField(max_length=20,
                         choices=[('pending','Pending'),('completed','Completed')])
    notes            = models.TextField(blank=True)

    def __str__(self):
        return f"{self.batch_id} — {self.status}"
