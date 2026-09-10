---
layout: default
title: TensorOps API Reference
---

# TensorOps - Advanced Tensor Operations

Complete API reference for `tech.kayys.gollek.sdk.core.TensorOps` - PyTorch-equivalent tensor indexing and manipulation.

## Module Location

```
gollek-sdk-tensor/src/main/java/tech/kayys/gollek/sdk/core/TensorOps.java
```

## Overview

`TensorOps` provides comprehensive tensor manipulation operations:

- **Slicing & Indexing** - Extract subarrays along dimensions
- **Concatenation & Stacking** - Combine multiple tensors
- **Gathering & Scattering** - Index-based selection and updates
- **Boolean Operations** - Conditional selection and filling
- **Comparisons** - Element-wise comparison operations

All operations maintain gradient tracking and work with autograd.

---

## Slicing Operations

### slice()

Extract a contiguous slice along a dimension.

**Signature:**
```java
public static Tensor slice(Tensor tensor, int dim, long start, long end)
```

**Parameters:**
- `tensor` - Input tensor to slice
- `dim` - Dimension along which to slice (0-based)
- `start` - Start index (inclusive)
- `end` - End index (exclusive)

**Returns:** Sliced tensor with shape `[..., end-start, ...]`

**Example:**
```java
Tensor x = Tensor.randn(10, 20, 30);

// Select indices 5-15 along dimension 1
Tensor sliced = TensorOps.slice(x, 1, 5, 15);
// Result shape: (10, 10, 30)

// Select first 5 elements along dimension 0
Tensor first5 = TensorOps.slice(x, 0, 0, 5);
// Result shape: (5, 20, 30)
```

**Errors:**
- `IndexOutOfBoundsException` if indices are invalid

**Implementation:** Uses stride-based indexing for efficient memory access

---

### index()

Get single element along dimension.

**Signature:**
```java
public static Tensor index(Tensor tensor, int dim, long index)
```

**Parameters:**
- `tensor` - Input tensor
- `dim` - Dimension
- `index` - Index value

**Returns:** Tensor with dimension removed and size reduced by 1

**Example:**
```java
Tensor x = Tensor.randn(10, 20, 30);

// Get element at index 5 along dimension 1
Tensor selected = TensorOps.index(x, 1, 5);
// Result shape: (10, 30) - middle dimension removed
```

---

### indexSelect()

Select multiple elements by indices along a dimension.

**Signature:**
```java
public static Tensor indexSelect(Tensor tensor, int dim, Tensor indices)
```

**Parameters:**
- `tensor` - Input tensor
- `dim` - Dimension to index
- `indices` - 1D tensor of indices to select

**Returns:** Tensor with selected indices along dimension

**Example:**
```java
Tensor x = Tensor.randn(10, 20, 30);
Tensor idx = Tensor.of(new float[]{0, 5, 10, 15}, 4);

// Select indices [0, 5, 10, 15] along dimension 1
Tensor selected = TensorOps.indexSelect(x, 1, idx);
// Result shape: (10, 4, 30)
```

---

## Concatenation & Stacking

### cat()

Concatenate tensors along an existing dimension.

**Signature:**
```java
public static Tensor cat(int dim, List<Tensor> tensors)
```

**Parameters:**
- `dim` - Dimension to concatenate along
- `tensors` - List of tensors to concatenate

**Returns:** Concatenated tensor

**Requirements:**
- All tensors must have same number of dimensions
- All dimensions except `dim` must have matching sizes

**Example:**
```java
Tensor x = Tensor.randn(2, 10, 20);
Tensor y = Tensor.randn(2, 15, 20);
Tensor z = Tensor.randn(2, 5, 20);

// Concatenate along dimension 1
Tensor result = TensorOps.cat(1, List.of(x, y, z));
// Result shape: (2, 30, 20) - 10 + 15 + 5 = 30

// Concatenate along dimension 0
Tensor stacked = TensorOps.cat(0, List.of(x, x));
// Result shape: (4, 10, 20)
```

**Performance:** O(n) where n is total elements

---

### stack()

Stack tensors into a new dimension.

**Signature:**
```java
public static Tensor stack(int dim, List<Tensor> tensors)
```

**Parameters:**
- `dim` - Position to create new dimension (0-based)
- `tensors` - List of tensors with identical shapes

**Returns:** Stacked tensor with new dimension

**Requirements:**
- All tensors must have **identical** shapes

**Example:**
```java
Tensor x = Tensor.randn(10, 20);
Tensor y = Tensor.randn(10, 20);
Tensor z = Tensor.randn(10, 20);

// Stack along new dimension 0
Tensor stacked = TensorOps.stack(0, List.of(x, y, z));
// Result shape: (3, 10, 20)

// Stack along new dimension 2
Tensor stacked2 = TensorOps.stack(2, List.of(x, y));
// Result shape: (10, 20, 2)
```

**vs. cat():**
- `cat()`: Combines along existing dimension
- `stack()`: Creates new dimension

---

## Gathering & Scattering

### gather()

Select elements using index tensor (PyTorch torch.gather equivalent).

**Signature:**
```java
public static Tensor gather(int dim, Tensor tensor, Tensor indices)
```

**Parameters:**
- `dim` - Dimension to gather along
- `tensor` - Source tensor
- `indices` - Index tensor (same shape as output except in `dim`)

**Returns:** Gathered tensor

**Example:**
```java
Tensor x = Tensor.of(
    new float[]{1,2,3,4, 5,6,7,8, 9,10,11,12},
    3, 4
);  // Shape: (3, 4)

Tensor idx = Tensor.of(new float[]{0, 2, 1}, 3, 1);  // Shape: (3, 1)

// Gather along dimension 1
Tensor result = TensorOps.gather(1, x, idx);
// Selects [1, 3, 2] from row 1, [5, 7, 6] from row 2, etc.
```

**Common Use Case:** Select top-k predictions in classification

---

### scatter()

Scatter updates into a tensor using indices.

**Signature:**
```java
public static Tensor scatter(int dim, Tensor tensor, Tensor indices, Tensor updates)
```

**Parameters:**
- `dim` - Dimension to scatter along
- `tensor` - Destination tensor (will be cloned)
- `indices` - Index tensor
- `updates` - Values to scatter

**Returns:** New tensor with scattered updates

**Example:**
```java
Tensor dest = Tensor.zeros(3, 4);
Tensor idx = Tensor.of(new float[]{0, 2}, 2);
Tensor vals = Tensor.of(new float[]{10, 20}, 2);

// Scatter along dimension 1
Tensor result = TensorOps.scatter(1, dest, idx, vals);
// Updates indices [0, 2] in each row with values
```

**Note:** Inverse operation of `gather()`

---

## Boolean Operations

### maskedSelect()

Select elements where mask is true.

**Signature:**
```java
public static Tensor maskedSelect(Tensor tensor, Tensor mask)
```

**Parameters:**
- `tensor` - Input tensor
- `mask` - Boolean mask (same shape as tensor, non-zero = true)

**Returns:** 1D tensor with selected elements

**Example:**
```java
Tensor x = Tensor.randn(10, 20);

// Create mask for positive elements
Tensor mask = TensorOps.gt(x, 0);

// Select positive elements
Tensor positive = TensorOps.maskedSelect(x, mask);
// Result shape: (n,) where n = number of positive elements
```

**Use Cases:**
- Filter outliers
- Select top-k elements
- Conditional sampling

---

### maskedFill()

Fill elements where mask is true with a scalar value.

**Signature:**
```java
public static Tensor maskedFill(Tensor tensor, Tensor mask, float value)
```

**Parameters:**
- `tensor` - Input tensor
- `mask` - Boolean mask
- `value` - Value to fill

**Returns:** New tensor with selected elements filled

**Example:**
```java
Tensor x = Tensor.randn(10, 20);

// Create mask for negative elements
Tensor mask = TensorOps.lt(x, 0);

// Replace negative with 0 (ReLU-like)
Tensor clipped = TensorOps.maskedFill(x, mask, 0);

// Replace values > 1 with 1 (clipping)
Tensor bounded = TensorOps.maskedFill(x, TensorOps.gt(x, 1), 1);
```

**Use Cases:**
- Thresholding
- Clipping
- Masking padded sequences

---

## Comparison Operations

### gt()

Element-wise greater-than comparison.

**Signature:**
```java
public static Tensor gt(Tensor tensor, float other)
```

**Returns:** Boolean tensor (1.0 for true, 0.0 for false)

**Example:**
```java
Tensor x = Tensor.of(new float[]{1, 2, 3, 4, 5}, 5);
Tensor mask = TensorOps.gt(x, 3);
// Result: [0, 0, 0, 1, 1]
```

---

### lt()

Element-wise less-than comparison.

**Signature:**
```java
public static Tensor lt(Tensor tensor, float other)
```

---

### ge()

Element-wise greater-than-or-equal comparison.

**Signature:**
```java
public static Tensor ge(Tensor tensor, float other)
```

---

### le()

Element-wise less-than-or-equal comparison.

**Signature:**
```java
public static Tensor le(Tensor tensor, float other)
```

---

### eq()

Element-wise equality comparison.

**Signature:**
```java
public static Tensor eq(Tensor tensor, float other)
```

---

## Best Practices

### 1. Use slice() for contiguous subarrays

```java
// ✅ Good - Efficient contiguous slice
Tensor sliced = TensorOps.slice(x, 1, 10, 20);

// ❌ Avoid - Creates intermediate tensors
List<Tensor> parts = new ArrayList<>();
for (int i = 10; i < 20; i++) {
    parts.add(TensorOps.index(x, 1, i));
}
```

### 2. Pre-allocate gather indices

```java
// ✅ Good - Single gather operation
Tensor indices = Tensor.of(topKIndices);
Tensor topK = TensorOps.gather(1, logits, indices);

// ❌ Avoid - Loop creates overhead
for (int i = 0; i < k; i++) {
    TensorOps.index(logits, 1, topKIndices[i]);
}
```

### 3. Chain comparisons efficiently

```java
// ✅ Good - Single masked operation
Tensor inRange = TensorOps.maskedSelect(
    x,
    TensorOps.ge(TensorOps.le(x, 1), 0)
);

// ❌ Avoid - Multiple allocations
Tensor gt0 = TensorOps.gt(x, 0);
Tensor lt1 = TensorOps.lt(x, 1);
// ... combine manually
```

---

## Performance Characteristics

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|-----------------|------------------|-------|
| slice() | O(n) | O(n) | n = output elements |
| cat() | O(n) | O(n) | n = total elements |
| stack() | O(n) | O(n) | Creates new dimension |
| gather() | O(n) | O(n) | Index-based selection |
| maskedSelect() | O(n) | O(k) | k = selected elements |
| maskedFill() | O(n) | O(n) | n = tensor elements |

---

## Common Patterns

### Batch Selection

```java
// Select specific samples from batch
Tensor batch = Tensor.randn(64, 10, 20);
Tensor selectedIdx = Tensor.of(new float[]{0, 5, 10}, 3);

Tensor selected = TensorOps.indexSelect(batch, 0, selectedIdx);
// Result: (3, 10, 20)
```

### Top-K Selection

```java
// Get top-k logits (pseudo-code)
Tensor logits = model.forward(input);  // (batch, 1000)
Tensor topKVals, topKIdx = torch.topk(logits, 5);

Tensor topK = TensorOps.gather(1, logits, topKIdx);
```

### Sequence Masking

```java
// Mask padding tokens
Tensor tokens = ...;  // (batch, seq_len)
Tensor padMask = TensorOps.ne(tokens, 0);  // 1 for real tokens

Tensor masked = TensorOps.maskedFill(
    attentionWeights,
    TensorOps.eq(padMask, 0),
    Float.NEGATIVE_INFINITY
);
```

---

## See Also

- [Tensor API](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-tensor)
- [GradTensor Autograd](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-autograd)
- [Vision Transforms](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-vision)
- [Examples Docs](/docs/setup/examples-docs)
