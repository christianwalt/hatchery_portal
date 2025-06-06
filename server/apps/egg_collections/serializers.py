# apps/egg_collections/serializers.py

from rest_framework import serializers
from .models import EggCollection

class EggCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EggCollection
        fields = '__all__'
