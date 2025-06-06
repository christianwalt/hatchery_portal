# apps/incubation/admin.py

from django.contrib import admin
from .models import Incubator, IncubationBatch

@admin.register(Incubator)
class IncubatorAdmin(admin.ModelAdmin):
    list_display  = ('name', 'location', 'capacity')
    search_fields = ('name',)

@admin.register(IncubationBatch)
class IncubationBatchAdmin(admin.ModelAdmin):
    list_display  = ('batch_id', 'incubator', 'start_date', 'expected_hatch_date', 'status')
    list_filter   = ('incubator', 'status')
    search_fields = ('batch_id', 'breed')
