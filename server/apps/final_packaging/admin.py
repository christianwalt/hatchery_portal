from django.contrib import admin
from .models import PackagingBatch

@admin.register(PackagingBatch)
class PackagingBatchAdmin(admin.ModelAdmin):
    list_display  = (
        'batch_id', 'label', 'packaging_date',
        'full_boxes', 'chicks_packed', 'status'
    )
    list_filter   = ('status', 'packaging_date')
    search_fields = ('batch_id', 'label')
