# apps/sales/admin.py

from django.contrib import admin
from .models import SaleRecord

@admin.register(SaleRecord)
class SaleRecordAdmin(admin.ModelAdmin):
    list_display  = (
        'batch_id', 'date', 'customer',
        'quantity', 'total_amount', 'paid', 'balance', 'status'
    )
    list_filter   = ('date', 'status', 'payment_method')
    search_fields = ('batch_id', 'customer', 'product_type')
