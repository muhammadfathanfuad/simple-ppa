import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Custom hook for pagination
export const usePagination = (fetchFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const mergedParams = { ...params, ...newParams };
      const response = await fetchFunction(mergedParams);
      
      setData(response.data.laporan || response.data || []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
      
      setParams(mergedParams);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);

  useEffect(() => {
    fetchData();
  }, []);

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchData({ ...params, page: pagination.page + 1 });
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      fetchData({ ...params, page: pagination.page - 1 });
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchData({ ...params, page });
    }
  };

  const updateParams = (newParams) => {
    fetchData({ ...newParams, page: 1 }); // Reset to first page when changing filters
  };

  const reset = () => {
    setData([]);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
    setParams(initialParams);
  };

  return {
    data,
    loading,
    error,
    pagination,
    params,
    fetchData,
    nextPage,
    prevPage,
    goToPage,
    updateParams,
    reset,
  };
};

// Custom hook for form handling
export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setTouchedField = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setValue(name, fieldValue);
  }, [setValue]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouchedField(name);
  }, [setTouchedField]);

  const validateField = useCallback((name, value) => {
    if (!validationSchema) return '';
    
    try {
      validationSchema.validateSyncAt(name, { [name]: value });
      return '';
    } catch (error) {
      return error.message;
    }
  }, [validationSchema]);

  const validateForm = useCallback(() => {
    if (!validationSchema) return true;

    try {
      validationSchema.validateSync(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, [validationSchema, values]);

  const handleSubmit = useCallback(async (onSubmit) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Validate field on value change
  useEffect(() => {
    Object.keys(values).forEach(name => {
      if (touched[name]) {
        const error = validateField(name, values[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    });
  }, [values, touched, validateField]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setTouchedField,
    resetForm,
    validateField,
    validateForm,
  };
};

export default useApi;