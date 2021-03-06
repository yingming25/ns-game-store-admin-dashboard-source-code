import axios from 'axios';
import $ from 'jquery';

export default {
  namespaced: true,
  state: {
    products: [],
    tempProduct: {
      title: '[賣]動物園造型衣服3',
      category: '衣服2',
      origin_price: 100,
      price: 300,
      unit: '個',
      image: 'test.testtest',
      description: 'Sit down please 名設計師設計',
      content: '這是內容',
      is_enabled: 1,
      imageUrl: '',
    },
    pagination: {},
    isNew: false,
    isUploadImage: false,
    product: {},
  },
  actions: {
    getProducts(context, page) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/products?page=${page}`;

      context.dispatch('updateLoading', true, { root: true });

      axios.get(api).then(response => {
        context.commit('PRODUCTS', response.data.products);
        context.commit('PAGINATION', response.data.pagination);
        context.dispatch('updateLoading', false, { root: true });
      });
    },
    productModal(context, { isNew, item }) {
      if (isNew) {
        context.commit('TEMP_PRODUCT', {});
        context.commit('IS_NEW', true);
      } else {
        context.commit('TEMP_PRODUCT', Object.assign({}, item));
        context.commit('IS_NEW', false);
      }

      $('#productModal').modal('show');
    },
    delProductModal(context, item) {
      context.commit('TEMP_PRODUCT', Object.assign({}, item));

      $('#delProductModal').modal('show');
    },
    updateProduct(context) {
      let api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/product`;
      let httpMethod = 'post';
      if (!context.state.isNew) {
        api = `${process.env.VUE_APP_API_PATH}/api/${
          process.env.VUE_APP_CUSTOM_PATH
        }/admin/product/${context.state.tempProduct.id}`;
        httpMethod = 'put';
      }
      axios[httpMethod](api, { data: context.state.tempProduct }).then(response => {
        if (response.data.success) {
          $('#productModal').modal('hide');
          context.dispatch('productsModule/getProducts', null, { root: true });
          if (context.state.isNew) {
            const { message } = response.data;
            const status = 'success';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          } else {
            const { message } = response.data;
            const status = 'success';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          }
        } else {
          $('#productModal').modal('hide');
          context.dispatch('productsModule/getProducts', null, { root: true });
          if (context.state.isNew) {
            const { message } = response.data;
            const status = 'danger';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          } else {
            const { message } = response.data;
            const status = 'danger';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          }
        }
      });
    },
    removeProduct(context, id) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/product/${id}`;
      axios.delete(api).then(response => {
        if (response.data.success) {
          $('#delProductModal').modal('hide');

          context.dispatch('getProducts');

          const { message } = response.data;
          const status = 'success';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
        } else {
          $('#delProductModal').modal('hide');
          context.dispatch('getProducts');

          const { message } = response.data;
          const status = 'danger';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
        }
      });
    },
    getProduct(context, id) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/product/${id}`;

      context.dispatch('updateLoadingItem', id, { root: true });

      axios.get(api).then(response => {
        if (response.data.success) {
          context.commit('PRODUCT', response.data.product);

          $('#productModal').modal('show');

          context.dispatch('updateLoadingItem', '', { root: true });
        }
      });
    },
    uploadImage(context, uploadedImage) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/upload`;
      const formData = new FormData();
      formData.append('file-to-upload', uploadedImage);
      context.commit('IS_UPLOAD_IMAGE', true);
      axios
        .post(api, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          if (response.data.success) {
            const message = '圖片上傳成功';
            const status = 'success';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
            context.commit('IMAGE_URL', response.data.imageUrl);
            context.commit('IS_UPLOAD_IMAGE', false);
          } else {
            const { message } = response.data;
            const status = 'danger';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
            context.commit('IS_UPLOAD_IMAGE', false);
          }
        });
    },
    updateTitle(context, title) {
      context.commit('TITLE', title);
    },
    updateCategory(context, category) {
      context.commit('CATEGORY', category);
    },
    updateOriginPrice(context, originPrice) {
      context.commit('ORIGIN_PRICE', originPrice);
    },
    updatePrice(context, price) {
      context.commit('PRICE', price);
    },
    updateUnit(context, unit) {
      context.commit('UNIT', unit);
    },
    updateDescription(context, description) {
      context.commit('DESCRIPTION', description);
    },
    updateContent(context, content) {
      context.commit('CONTENT', content);
    },
    updateIsEnabled(context, isEnabled) {
      context.commit('IS_ENABLED', isEnabled);
    },
  },
  mutations: {
    PRODUCTS(state, products) {
      state.products = products;
    },
    PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    TEMP_PRODUCT(state, tempProduct) {
      state.tempProduct = tempProduct;
    },
    IS_NEW(state, isNew) {
      state.isNew = isNew;
    },
    TITLE(state, title) {
      state.tempProduct.title = title;
    },
    CATEGORY(state, category) {
      state.tempProduct.category = category;
    },
    ORIGIN_PRICE(state, originPrice) {
      state.tempProduct.origin_price = originPrice;
    },
    PRICE(state, price) {
      state.tempProduct.price = price;
    },
    UNIT(state, unit) {
      state.tempProduct.unit = unit;
    },
    DESCRIPTION(state, description) {
      state.tempProduct.description = description;
    },
    CONTENT(state, content) {
      state.tempProduct.content = content;
    },
    IS_ENABLED(state, isEnabled) {
      state.tempProduct.is_enabled = isEnabled;
    },
    IMAGE_URL(state, imageUrl) {
      state.tempProduct.imageUrl = imageUrl;
    },
    IS_UPLOAD_IMAGE(state, isUploadImage) {
      state.isUploadImage = isUploadImage;
    },
    PRODUCT(state, product) {
      state.product = product;
    },
  },
  getters: {
    products(state) {
      return state.products;
    },
    pagination(state) {
      return state.pagination;
    },
    tempProduct(state) {
      return state.tempProduct;
    },
    isNew(state) {
      return state.isNew;
    },
    isUploadImage(state) {
      return state.isUploadImage;
    },
    product(state) {
      return state.product;
    },
  },
};
