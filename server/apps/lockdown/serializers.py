# apps/lockdown/serializers.py

from rest_framework import serializers
from .models import LockdownBatch

class LockdownBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LockdownBatch
        fields = '__all__'
