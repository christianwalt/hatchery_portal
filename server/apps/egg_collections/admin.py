from django.contrib import admin
from .models import EggCollection

@admin.register(EggCollection)
class EggCollectionAdmin(admin.ModelAdmin):
    list_display = ('farmer_name', 'label', 'date', 'full_trays', 'damaged_eggs')
    search_fields = ('farmer_name', 'label')
    list_filter  = ('date', 'animal_type')
