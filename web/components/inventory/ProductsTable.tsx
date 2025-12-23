'use client';

import { useState } from 'react';
import { clientTrpc } from '@seed/api/client';
import { useBusiness } from '@/providers/BusinessProvider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
} from 'lucide-react';
import ProductDetailSheet from './ProductDetailSheet';
import type { Product } from '@seed/database';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductWithCategory extends Product {
  category?: {
    id: string;
    name: string;
  } | null;
}

type SortOrder = 'asc' | 'desc';
type OrderBy = 'createdAt' | 'name' | 'currentStockLevel' | 'sellingPrice';
type StockStatus = 'all' | 'inStock' | 'lowStock' | 'outOfStock';

export default function ProductsTable() {
  const { currentBusinessMembership } = useBusiness();
  const activeBusiness = currentBusinessMembership?.business;
  const utils = clientTrpc.useUtils();

  // Table state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<OrderBy>('createdAt');
  const [order, setOrder] = useState<SortOrder>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] =
    useState<StockStatus>('all');

  // Sheet state
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithCategory | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Delete dialog state
  const [productToDelete, setProductToDelete] =
    useState<ProductWithCategory | null>(null);

  // Fetch products
  const { data, isLoading, isError } =
    clientTrpc.inventory.getProducts.useQuery(
      {
        businessId: activeBusiness?.id || '',
        pageSize,
        pageNumber,
        order,
        orderBy,
        search: search || undefined,
        categoryId: categoryFilter || undefined,
        isActive:
          activeFilter === 'all'
            ? undefined
            : activeFilter === 'active'
              ? true
              : false,
        stockStatus: stockStatusFilter,
      },
      {
        enabled: !!activeBusiness?.id,
      },
    );

  // Fetch categories for filter
  const { data: categories } =
    clientTrpc.category.getCategoriesByBusinessId.useQuery(
      { businessId: activeBusiness?.id || '' },
      { enabled: !!activeBusiness?.id },
    );

  // Delete mutation
  const deleteMutation = clientTrpc.inventory.deleteProduct.useMutation({
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      utils.inventory.getProducts.invalidate();
      setProductToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });

  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSort = (column: OrderBy) => {
    if (orderBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(column);
      setOrder('asc');
    }
  };

  const getSortIcon = (column: OrderBy) => {
    if (orderBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return order === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const getStockBadge = (stock: any) => {
    const stockNum =
      typeof stock === 'string'
        ? parseFloat(stock)
        : typeof stock === 'number'
          ? stock
          : Number(stock);
    if (stockNum <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (stockNum < 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    }
    return <Badge>In Stock</Badge>;
  };

  const formatCurrency = (value: any) => {
    const numValue =
      typeof value === 'string'
        ? parseFloat(value)
        : typeof value === 'number'
          ? value
          : Number(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numValue);
  };

  const handleRowClick = (product: ProductWithCategory) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (
    product: ProductWithCategory,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate({ id: productToDelete.id });
    }
  };

  if (!activeBusiness) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">No active business selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name, SKU, or barcode..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(1);
            }}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value);
            setPageNumber(1);
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Active Status Filter */}
        <Select
          value={activeFilter}
          onValueChange={(value) => {
            setActiveFilter(value);
            setPageNumber(1);
          }}
        >
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Stock Status Filter */}
        <Select
          value={stockStatusFilter}
          onValueChange={(value: StockStatus) => {
            setStockStatusFilter(value);
            setPageNumber(1);
          }}
        >
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="inStock">In Stock</SelectItem>
            <SelectItem value="lowStock">Low Stock</SelectItem>
            <SelectItem value="outOfStock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="flex items-center"
                >
                  Name
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('currentStockLevel')}
                  className="flex items-center"
                >
                  Stock
                  {getSortIcon('currentStockLevel')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('sellingPrice')}
                  className="flex items-center"
                >
                  Price
                  {getSortIcon('sellingPrice')}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-50" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-25" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-30" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500">
                  Error loading products
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground text-center"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(product)}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    {product.category?.name || (
                      <span className="text-muted-foreground">
                        Uncategorized
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{String(product.currentStockLevel)}</span>
                      {getStockBadge(product.currentStockLevel)}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(product.sellingPrice)}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDeleteClick(product, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {products.length === 0 ? 0 : (pageNumber - 1) * pageSize + 1}{' '}
          to {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}{' '}
          products
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPageNumber(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber(1)}
              disabled={pageNumber === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={pageNumber === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm">
                Page {pageNumber} of {totalPages || 1}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setPageNumber((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={pageNumber >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber(totalPages)}
              disabled={pageNumber >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product &quot;
              {productToDelete?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
