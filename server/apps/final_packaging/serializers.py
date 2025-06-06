from rest_framework import serializers
from .models import PackagingBatch

class PackagingBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PackagingBatch
        fields = '__all__'
