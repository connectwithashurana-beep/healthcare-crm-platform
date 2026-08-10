from rest_framework.routers import DefaultRouter
from .views import CustomerView
router = DefaultRouter()
router.register("customers", CustomerView)
urlpatterns = router.urls   

