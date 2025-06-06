# apps/lockdown/admin.py

from django.contrib import admin
from .models import LockdownBatch

@admin.register(LockdownBatch)
class LockdownBatchAdmin(admin.ModelAdmin):
    list_display  = ('batch_id', 'label', 'lockdown_date', 'quantity', 'notification_sent')
    list_filter   = ('lockdown_date', 'notification_sent')
    search_fields = ('batch_id', 'label')
