# apps/sales/models.py

from django.db import models
from django.utils import timezone

class SaleRecord(models.Model):
    batch_id       = models.CharField(max_length=50)
    date           = models.DateField(default=timezone.now)
    customer       = models.CharField(max_length=100)                           
    product_type   = models.CharField(max_length=50)
    quantity       = models.PositiveIntegerField()
    unit_price     = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount   = models.DecimalField(max_digits=12, decimal_places=2)
    paid           = models.DecimalField(max_digits=12, decimal_places=2)
    balance        = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # e.g., Cash, Mobile Money
    status         = models.CharField(
                       max_length=20,
                       choices=[
                         ('pending',   'Pending'),
                         ('completed', 'Completed'),
                         ('cancelled', 'Cancelled')
                       ]
                     )                               
    notes          = models.TextField(blank=True)

    def __str__(self):
        return f"Sale {self.batch_id} to {self.customer}"
