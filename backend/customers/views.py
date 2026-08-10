from rest_framework import viewsets
from .models import Customer
from .serializers import CustomerSerializer
class CustomerView(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    