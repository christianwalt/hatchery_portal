# apps/egg_candling/admin.py

from django.contrib import admin
from .models import FertileEggCandling, ClearEggCandling

@admin.register(FertileEggCandling)
class FertileEggCandlingAdmin(admin.ModelAdmin):
    list_display  = ('batch_id', 'candling_date', 'count')
    search_fields = ('batch_id',)
    list_filter   = ('candling_date',)

@admin.register(ClearEggCandling)
class ClearEggCandlingAdmin(admin.ModelAdmin):
    list_display  = ('batch_id', 'candling_date', 'count')
    search_fields = ('batch_id',)
    list_filter   = ('candling_date',)
