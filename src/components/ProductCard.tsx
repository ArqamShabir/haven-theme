import { Link } from 'react-router-dom';
import { ShopifyProduct } from '@/stores/productStore';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { node } = product;
  const firstImage = node.images.edges[0]?.node;
  const secondImage = node.images.edges[1]?.node;
  const price = node.priceRange.minVariantPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${node.handle}`} className="group block">
        <div className="product-image-wrap relative">
          {firstImage && (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className={`w-full h-full object-cover ${secondImage ? 'group-hover:opacity-0' : ''} transition-opacity duration-400`}
              loading="lazy"
            />
          )}
          {secondImage && (
            <img
              src={secondImage.url}
              alt={secondImage.altText || node.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              loading="lazy"
            />
          )}
          {!firstImage && (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}

          {/* View details on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-background/90 backdrop-blur-sm flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="caps-label text-[11px] text-foreground">View details</span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-foreground">{node.title}</p>
          <p className="text-sm font-light text-foreground price-display">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
