# apps/egg_settings/admin.py

from django.contrib import admin
from .models import EggSetting

@admin.register(EggSetting)
class EggSettingAdmin(admin.ModelAdmin):
    list_display  = ('batch_id', 'setting_date', 'eggs_set', 'reject_eggs')
    list_filter   = ('setting_date', 'type_of_eggs')
    search_fields = ('batch_id',)
