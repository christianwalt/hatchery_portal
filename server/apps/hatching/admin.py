# apps/hatching/admin.py

from django.contrib import admin
from .models import HatchingRecord

@admin.register(HatchingRecord)
class HatchingRecordAdmin(admin.ModelAdmin):
    list_display  = ('batch_id', 'label', 'hatch_date', 'status', 'hatched_eggs')
    list_filter   = ('status', 'hatch_date')
    search_fields = ('batch_id', 'label')
