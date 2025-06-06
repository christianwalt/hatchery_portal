# apps/alerts/admin.py

from django.contrib import admin
from .models import Alert

@admin.register(Alert)  # Decorator-based registration for brevity
class AlertAdmin(admin.ModelAdmin):
    list_display  = (
        'type', 'severity', 'source',
        'timestamp', 'status'
    )
    list_filter   = ('severity', 'status', 'timestamp')
    search_fields = ('type', 'source', 'message')
