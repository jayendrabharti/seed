'use client';

import { clientTrpc } from '@seed/api/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusiness } from '@/providers/BusinessProvider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, X } from 'lucide-react';
import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  image: z.string().optional(), // Will be set after upload
  attachments: z.string().optional(), // Will be set after upload
  unit: z.string(),
  secondaryUnit: z.string().optional(),
  unitConvertion: z.string().optional(),
  currentStockLevel: z.string(),
  minStockLevel: z.string().optional(),
  maxStockLevel: z.string().optional(),
  reorderLevel: z.string().optional(),
  costPrice: z.string().min(1, 'Cost price is required'),
  sellingPrice: z.string().min(1, 'Selling price is required'),
  mrp: z.string().optional(),
  taxRate: z.string(),
  discountRate: z.string(),
  isActive: z.boolean(),
  isService: z.boolean(),
  allowNegative: z.boolean(),
  categoryId: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AddProductForm() {
  const { currentBusinessMembership } = useBusiness();
  const activeBusiness = currentBusinessMembership?.business;
  const router = useRouter();
  const utils = clientTrpc.useUtils();
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  // File state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  const getPresignedUrl = clientTrpc.s3.getPresignedUrl.useMutation();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      barcode: '',
      brand: '',
      model: '',
      color: '',
      size: '',
      weight: '',
      dimensions: '',
      image: '',
      attachments: '',
      unit: 'pcs',
      secondaryUnit: '',
      unitConvertion: '',
      currentStockLevel: '0',
      minStockLevel: '',
      maxStockLevel: '',
      reorderLevel: '',
      costPrice: '',
      sellingPrice: '',
      mrp: '',
      taxRate: '0',
      discountRate: '0',
      isActive: true,
      isService: false,
      allowNegative: false,
      categoryId: '',
    },
  });

  const { data: categories, isLoading: categoriesLoading } =
    clientTrpc.category.getCategoriesByBusinessId.useQuery(
      { businessId: activeBusiness?.id || '' },
      { enabled: !!activeBusiness?.id },
    );

  const addProductMutation = clientTrpc.inventory.addProduct.useMutation({
    onSuccess: () => {
      toast.success('Product added successfully!');
      utils.inventory.getProducts.invalidate();
      router.push('/inventory');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add product');
    },
  });

  const createCategoryMutation = clientTrpc.category.createCategory.useMutation(
    {
      onSuccess: (newCategory: any) => {
        toast.success('Category created successfully!');
        utils.category.getCategoriesByBusinessId.invalidate();
        form.setValue('categoryId', newCategory.id);
        setIsCreatingCategory(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create category');
      },
    },
  );

  const onSubmit = async (data: ProductFormValues) => {
    if (!activeBusiness?.id) {
      toast.error('No active business selected');
      return;
    }

    let imageUrl = '';
    let attachmentUrls: string[] = [];

    try {
      // 1. Upload image if selected
      if (selectedImage) {
        const presigned = await getPresignedUrl.mutateAsync({
          fileName: selectedImage.name,
          contentType: selectedImage.type,
          isPublic: true,
        });
        await fetch(presigned.uploadUrl, {
          method: 'PUT',
          body: selectedImage,
          headers: { 'Content-Type': selectedImage.type },
        });
        imageUrl = presigned.publicUrl || '';
      }

      // 2. Upload attachments if any
      if (attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
          const file = attachments[i];
          const presigned = await getPresignedUrl.mutateAsync({
            fileName: file.name,
            contentType: file.type,
            isPublic: true,
          });
          await fetch(presigned.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });
          if (presigned.publicUrl) attachmentUrls.push(presigned.publicUrl);
        }
      }

      // 3. Transform and submit product data
      const transformedData = {
        ...data,
        image: imageUrl,
        attachments: attachmentUrls,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        unitConvertion: data.unitConvertion
          ? parseFloat(data.unitConvertion)
          : undefined,
        currentStockLevel: parseFloat(data.currentStockLevel || '0'),
        minStockLevel: data.minStockLevel
          ? parseFloat(data.minStockLevel)
          : undefined,
        maxStockLevel: data.maxStockLevel
          ? parseFloat(data.maxStockLevel)
          : undefined,
        reorderLevel: data.reorderLevel
          ? parseFloat(data.reorderLevel)
          : undefined,
        costPrice: parseFloat(data.costPrice),
        sellingPrice: parseFloat(data.sellingPrice),
        mrp: data.mrp ? parseFloat(data.mrp) : undefined,
        taxRate: parseFloat(data.taxRate || '0'),
        discountRate: parseFloat(data.discountRate || '0'),
        businessId: activeBusiness.id,
        categoryId: data.categoryId || undefined,
      };
      addProductMutation.mutate(transformedData);
    } catch (err) {
      toast.error('File upload failed. Please try again.');
    }
  };

  const handleCreateCategory = () => {
    if (!activeBusiness?.id) {
      toast.error('No active business selected');
      return;
    }

    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    createCategoryMutation.mutate({
      name: newCategoryName,
      businessId: activeBusiness.id,
      description: newCategoryDescription || undefined,
    });
  };

  if (!activeBusiness) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">No active business selected</p>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {/* Product Image Upload (styled) */}
              <div
                className={
                  'hover:border-primary bg-muted/50 relative flex min-h-30 max-w-xs cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition'
                }
                onClick={() =>
                  document.getElementById('product-image-input')?.click()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setSelectedImage(e.dataTransfer.files[0]);
                    setSelectedImageUrl(
                      URL.createObjectURL(e.dataTransfer.files[0]),
                    );
                  }
                }}
              >
                <input
                  id="product-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedImage(file);
                    setSelectedImageUrl(
                      file ? URL.createObjectURL(file) : null,
                    );
                  }}
                />
                {selectedImageUrl ? (
                  <div className="flex w-full flex-col items-center gap-2">
                    <img
                      src={selectedImageUrl}
                      alt="Preview"
                      className="rounded border object-contain"
                      style={{ maxWidth: 180, maxHeight: 180 }}
                    />
                    <span className="text-center text-xs break-all">
                      {selectedImage?.name}
                    </span>
                    <button
                      type="button"
                      className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setSelectedImageUrl(null);
                      }}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Plus className="h-8 w-8" />
                    <span className="text-xs">Click or drag an image here</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <FormDescription>Stock Keeping Unit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : categories && categories.length > 0 ? (
                            categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No categories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsCreatingCategory(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter weight"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>In kg</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10x20x30" {...field} />
                    </FormControl>
                    <FormDescription>L x W x H (cm)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Media (attachments as array with + button) */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="bg-muted flex items-center gap-1 rounded border px-2 py-1 text-xs"
                  >
                    <span className="max-w-30 truncate">{file.name}</span>
                    <button
                      type="button"
                      className="ml-1 hover:text-red-500"
                      onClick={() =>
                        setAttachments(attachments.filter((_, i) => i !== idx))
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => attachmentInputRef.current?.click()}
                  title="Add attachment"
                >
                  <Plus className="h-4 w-4" />
                  Add Attachment
                </Button>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setAttachments((prev) => [...prev, ...Array.from(files)]);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <div className="text-muted-foreground text-xs">
                You can add multiple files as attachments.
              </div>
            </CardContent>
          </Card>

          {/* Units */}
          <Card>
            <CardHeader>
              <CardTitle>Units</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="pcs" {...field} />
                    </FormControl>
                    <FormDescription>e.g., pcs, kg, liters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitConvertion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Conversion</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Conversion factor between units
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Inventory & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="currentStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock Level *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Stock Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reorderLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reorder Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mrp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MRP</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Maximum Retail Price</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Product is available for sale
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Service Item</FormLabel>
                      <FormDescription>
                        This is a service rather than a physical product
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allowNegative"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Allow Negative Stock
                      </FormLabel>
                      <FormDescription>
                        Allow stock level to go below zero
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/inventory')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={addProductMutation.isPending}
            >
              {addProductMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Product
            </Button>
          </div>
        </form>
      </Form>

      {/* Create Category Dialog */}
      <Dialog open={isCreatingCategory} onOpenChange={setIsCreatingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for your products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name *</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Enter category description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreatingCategory(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
