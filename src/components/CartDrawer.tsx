import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';

const CartDrawer = () => {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const currencyCode = items[0]?.price.currencyCode || 'USD';

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 hover:opacity-70 transition-opacity duration-150 relative" aria-label="Cart">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l border-border">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-serif text-xl">Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
              <p className="text-sm text-muted-foreground">Your cart is empty</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="w-20 h-24 bg-muted flex-shrink-0 overflow-hidden">
                    {item.product.node.images?.edges?.[0]?.node && (
                      <img
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.product.node.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.selectedOptions.map(o => o.value).join(' / ')}
                    </p>
                    <p className="text-sm text-foreground mt-1 price-display">
                      {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1 hover:opacity-70">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1 hover:opacity-70">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.variantId)} className="p-1 hover:opacity-70 ml-auto">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-shrink-0 border-t border-border pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="caps-label text-foreground">Total</span>
                <span className="text-foreground font-medium price-display">
                  {currencyCode} {totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
                className="btn-primary w-full"
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Checkout
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
