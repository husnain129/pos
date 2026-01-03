let cart = [];
let index = 0;
let allUsers = [];
let allProducts = [];
let allCategories = [];
let allTransactions = [];
let sold = [];
let state = [];
let sold_items = [];
let item;
let auth;
let holdOrder = 0;
let vat = 0;
let perms = null;
let deleteId = 0;
let paymentType = 0;
let receipt = "";
let totalVat = 0;
let subTotal = 0;
let method = "";
let order_index = 0;
let user_index = 0;
let product_index = 0;
let transaction_index;
let host = "localhost";
let path = require("path");
let port = "8001";
let moment = require("moment");
let Swal = require("sweetalert2");
let { ipcRenderer } = require("electron");
let dotInterval = setInterval(function () {
  $(".dot").text(".");
}, 3000);
let Store = require("electron-store");
const remote = require("@electron/remote");
let app;
let img_path;
let api = "http://" + host + ":" + port + "/api/";
let btoa = require("btoa");
let jsPDF = require("jspdf");
let html2canvas = require("html2canvas");
let JsBarcode = require("jsbarcode");
let macaddress = require("macaddress");
let categories = [];
let holdOrderList = [];
let customerOrderList = [];
let ownUserEdit = null;
let totalPrice = 0;
let orderTotal = 0;
let auth_error = "Incorrect username or password";
let auth_empty = "Please enter a username and password";
let holdOrderlocation = $("#randerHoldOrders");
let customerOrderLocation = $("#randerCustomerOrders");
let storage; // Initialize later when app is ready
let settings;
let platform;
let user = {};
let start = moment().startOf("month");
let end = moment();
let start_date = moment(start).toISOString();
let end_date = moment(end).toISOString();
let by_till = 0;
let by_user = 0;
let by_status = 1;

$(function () {
  // Update header with username and datetime
  function updateHeaderDateTime() {
    const now = moment().format("MMM DD, YYYY h:mm A");
    $("#header_datetime").text(now);
  }

  // Update datetime immediately and then every minute
  updateHeaderDateTime();
  setInterval(updateHeaderDateTime, 60000);

  // Update username in header when user logs in
  if (auth && auth.username) {
    $("#header_username").text(auth.username);
  }

  function cb(start, end) {
    $("#reportrange span").html(
      start.format("MMMM D, YYYY") + "  -  " + end.format("MMMM D, YYYY")
    );
  }

  $("#reportrange").daterangepicker(
    {
      startDate: start,
      endDate: end,
      autoApply: true,
      timePicker: true,
      timePicker24Hour: true,
      timePickerIncrement: 10,
      timePickerSeconds: true,
      // minDate: '',
      ranges: {
        Today: [moment().startOf("day"), moment()],
        Yesterday: [
          moment().subtract(1, "days").startOf("day"),
          moment().subtract(1, "days").endOf("day"),
        ],
        "Last 7 Days": [
          moment().subtract(6, "days").startOf("day"),
          moment().endOf("day"),
        ],
        "Last 30 Days": [
          moment().subtract(29, "days").startOf("day"),
          moment().endOf("day"),
        ],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "This Month": [moment().startOf("month"), moment()],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
    },
    cb
  );

  cb(start, end);
});

$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};

// Storage will be initialized when document is ready
// (moved to avoid "Cannot read properties of undefined" error)

$(document).ready(function () {
  // Initialize Bootstrap tooltips with body container to ensure proper z-index
  $('[data-bs-toggle="tooltip"]').tooltip({
    container: "body",
  });

  // Initialize Electron app and paths when document is ready
  // Try multiple ways to get the app object since contextIsolation is false
  try {
    // First try @electron/remote
    if (remote && remote.app) {
      app = remote.app;
    }
    // Fallback to direct electron require (works when contextIsolation is false)
    else {
      const electron = require("electron");
      app = electron.app || electron.remote?.app;
    }

    if (app) {
      img_path = app.getPath("appData") + "/POS/uploads/";
    } else {
      console.error("Electron app is not available");
      img_path = "./uploads/"; // Fallback path
    }
  } catch (error) {
    console.error("Failed to initialize Electron app:", error);
    img_path = "./uploads/"; // Fallback path
  }

  // Initialize storage here when app is ready
  // electron-store needs access to app object
  // Try multiple approaches to get the app object
  function initStorage() {
    try {
      let electronApp;

      // Try @electron/remote first
      if (remote && remote.app) {
        electronApp = remote.app;
      }
      // Fallback: try require('electron') directly (works when contextIsolation is false)
      else {
        try {
          const electron = require("electron");
          // In renderer with contextIsolation: false, we can't access app directly
          // But electron-store should handle this internally
        } catch (e) {
          console.warn("Could not access electron module directly");
        }
      }

      // Try to initialize Store - it should auto-detect app from @electron/remote
      // If that fails, we'll use a workaround
      try {
        storage = new Store();
      } catch (storeError) {
        // If Store initialization fails, try with explicit configuration
        console.warn(
          "Store initialization failed, trying alternative method..."
        );
        // electron-store v5+ should work with @electron/remote automatically
        // If it doesn't, we'll use localStorage as fallback
        storage = {
          get: function (key) {
            try {
              const value = localStorage.getItem("electron-store_" + key);
              return value ? JSON.parse(value) : undefined;
            } catch (e) {
              return undefined;
            }
          },
          set: function (key, value) {
            try {
              localStorage.setItem(
                "electron-store_" + key,
                JSON.stringify(value)
              );
            } catch (e) {
              console.error("Failed to save to localStorage:", e);
            }
            return this;
          },
          delete: function (key) {
            try {
              localStorage.removeItem("electron-store_" + key);
            } catch (e) {
              console.error("Failed to delete from localStorage:", e);
            }
            return this;
          },
        };
        console.warn("Using localStorage fallback for storage");
      }

      // Now get auth and user after storage is initialized
      auth = storage.get("auth");
      user = storage.get("user");

      // Continue with the rest of initialization
      initializeApp();
    } catch (error) {
      console.error("Failed to initialize storage:", error);
      console.error("Error details:", error.message);
      // Create a mock storage object to prevent further errors
      storage = {
        get: function () {
          return undefined;
        },
        set: function () {
          return this;
        },
        delete: function () {
          return this;
        },
      };
      // Continue with initialization even if storage fails
      initializeApp();
    }
  }

  // Wait a bit longer to ensure @electron/remote is fully initialized
  setTimeout(initStorage, 200);

  // Function to continue app initialization after storage is ready
  function initializeApp() {
    if (!auth) {
      auth = storage.get("auth");
    }
    if (!user || Object.keys(user).length === 0) {
      user = storage.get("user") || {};
    }

    if (auth == undefined) {
      $.get(api + "users/check/", function (data) {});

      // CRITICAL: Hide main app content and footer FIRST
      $(".main_app").css("display", "none");
      $("footer.login-footer").css("display", "none");

      // Add login-screen class to body and html to override padding with !important
      $("body").addClass("login-screen");
      $("html").addClass("login-screen");

      // Force remove any padding/margin that might interfere with !important
      $("body")[0].style.setProperty("padding-top", "0", "important");
      $("body")[0].style.setProperty("padding-bottom", "0", "important");
      $("body")[0].style.setProperty("margin", "0", "important");
      $("body")[0].style.setProperty("overflow", "hidden", "important");
      $("body")[0].style.setProperty("height", "100vh", "important");

      $("html")[0].style.setProperty("padding", "0", "important");
      $("html")[0].style.setProperty("margin", "0", "important");
      $("html")[0].style.setProperty("overflow", "hidden", "important");
      $("html")[0].style.setProperty("height", "100vh", "important");

      // Ensure loading div exists and is positioned correctly
      if ($("#loading").length === 0) {
        $("body").prepend('<div id="loading"></div>');
      }

      // Show loading/login screen
      $("#loading").addClass("show");

      // Render login form immediately
      authenticate();
    } else {
      // Remove login-screen class
      $("body").removeClass("login-screen");
      $("html").removeClass("login-screen");

      // Show main app content and footer when authenticated
      $(".main_app").show();
      $("footer.login-footer").show();
      // Allow body scrolling when authenticated
      $("body").css("overflow", "");
      $("#loading").removeClass("show").show();

      setTimeout(function () {
        $("#loading").hide();
      }, 2000);

      platform = storage.get("settings");

      if (platform != undefined) {
        if (platform.app == "Network Point of Sale Terminal") {
          api = "http://" + platform.ip + ":" + port + "/api/";
          perms = true;
        }
      }

      $.get(api + "users/user/" + user._id, function (data) {
        user = data;
        $("#loggedin-user").text(user.fullname);
      });

      $.get(api + "settings/get", function (data) {
        settings = data.settings;
      });

      $.get(api + "users/all", function (users) {
        allUsers = [...users];
      });
    }

    $(".loading").hide();

    loadInstitutes();
    loadCategories(function () {
      loadProducts();
      // Also populate the products view after loading
      setTimeout(function () {
        loadProductsView();
      }, 500);
    });
    loadCustomers();

    if (settings && settings.symbol) {
      $("#price_curr, #payment_curr, #change_curr").text(settings.symbol);
    }

    if (settings && settings.percentage) {
      vat = parseFloat(settings.percentage);
      $("#taxInfo").text(settings.charge_tax ? vat : 0);
    }

    if (0 == user.perm_products) {
      $(".p_one").hide();
    }
    if (0 == user.perm_categories) {
      $(".p_two").hide();
    }
    if (0 == user.perm_transactions) {
      $(".p_three").hide();
    }
    if (0 == user.perm_users) {
      $(".p_four").hide();
    }
    if (0 == user.perm_settings) {
      $(".p_five").hide();
    }

    // Role-based restrictions for cashiers
    if (user.role === "cashier" || user.role === "user") {
      // Hide add buttons for products, categories, and institutes
      $("#newProductModal").hide();
      $("#newCategoryModal").hide();
      $("#newInstituteModal").hide();
      $(".p_six").hide(); // Hide institutes completely for cashiers

      // Disable edit/delete functionality in modals
      $("body").addClass("cashier-mode");
    }

    function loadProducts() {
      $.get(api + "inventory/products", function (data) {
        data.forEach((item) => {
          item.price = parseFloat(item.price).toFixed(2);
        });

        allProducts = [...data];

        // Filter by institute if selected
        let displayProducts = data;
        let displayCategories = allCategories;

        console.log("loadProducts - filterInstituteId:", filterInstituteId);
        console.log("Total products before filter:", data.length);
        console.log("Total categories before filter:", allCategories.length);

        if (filterInstituteId > 0) {
          // Filter products that belong to the selected institute
          displayProducts = data.filter(
            (product) => product.institute_id == filterInstituteId
          );

          // Filter categories that belong to the selected institute
          displayCategories = allCategories.filter(
            (cat) => cat.institute_id == filterInstituteId
          );

          console.log("Filtered products:", displayProducts.length);
          console.log("Filtered categories:", displayCategories.length);
        }

        loadProductList();

        $("#parent").text("");
        $("#categories").html(
          `<button type="button" id="all" class="btn btn-categories btn-white waves-effect waves-light active">All</button> `
        );

        // Clear categories array before rebuilding
        categories = [];

        displayProducts.forEach((item) => {
          if (!categories.includes(item.category)) {
            categories.push(item.category);
          }

          // Handle missing SKU field
          const skuDisplay = item.sku || item._id || "";

          let item_info = `<div class="box ${item.category}"
                                onclick="$(this).addToCart(${item._id}, ${
            item.quantity
          }, ${item.stock})">
                            <div class="widget-panel widget-style-2 ">                    
                                        <div class="text-muted m-t-5 text-center">
                                        <div class="name" id="product_name" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 8px;">${
                                          item.name
                                        }</div> 
                                        <span class="sku" style="font-size: 12px; color: #666;">ID: ${skuDisplay}</span>
                                        <div style="margin-top: 10px;">
                                          <span class="stock" style="font-size: 11px; color: #999;">STOCK: </span>
                                          <span class="count" style="font-size: 13px; font-weight: 500; color: ${
                                            item.stock == 1 &&
                                            item.quantity <= 5
                                              ? "#f56954"
                                              : "#00a65a"
                                          }">${
            item.stock == 1 ? item.quantity : "N/A"
          }</span>
                                        </div>
                                        </div>
                                         <sp class="text-success text-center" style="display: block; margin-top: 12px; font-size: 18px;"><b data-plugin="counterup">${
                                           (settings && settings.symbol
                                             ? settings.symbol
                                             : "$") + item.price
                                         }</b> </sp>
                            </div>
                        </div>`;
          $("#parent").append(item_info);
        });

        categories.forEach((category) => {
          let c = displayCategories.filter(function (ctg) {
            return ctg._id == category;
          });

          if (c.length > 0) {
            $("#categories").append(
              `<button type="button" id="${category}" class="btn btn-categories btn-white waves-effect waves-light">${c[0].name}</button> `
            );
          }
        });

        // Also add categories that have no products yet
        displayCategories.forEach((category) => {
          if (!categories.includes(category._id)) {
            $("#categories").append(
              `<button type="button" id="${category._id}" class="btn btn-categories btn-white waves-effect waves-light">${category.name}</button> `
            );
          }
        });
      });
    }

    function loadCategories(callback) {
      $.get(api + "categories/all", function (data) {
        allCategories = data;
        loadCategoryList();
        $("#category").html(`<option value="0">Select</option>`);
        allCategories.forEach((category) => {
          $("#category").append(
            `<option value="${category._id}">${category.name}</option>`
          );
        });
        if (callback) {
          callback();
        }
      }).fail(function (error) {
        console.error("Failed to load categories:", error);
        if (callback) {
          callback();
        }
      });
    }

    // Function to populate product category dropdown filtered by institute
    function populateProductCategories(instituteId) {
      console.log("populateProductCategories called with:", instituteId);
      $("#category").html(`<option value="0">Select</option>`);

      let filteredCategories = allCategories;
      if (instituteId && instituteId != "") {
        filteredCategories = allCategories.filter(
          (cat) => cat.institute_id == instituteId
        );
        console.log("Filtered categories:", filteredCategories);
      }

      filteredCategories.forEach((category) => {
        $("#category").append(
          `<option value="${category._id}">${category.name}</option>`
        );
      });
      console.log("Total categories added:", filteredCategories.length);
    }

    function loadCustomers() {
      $.get(api + "customers/all", function (customers) {
        $("#customer").html(
          `<option value="0" selected="selected">Walk in customer</option>`
        );

        customers.forEach((cust) => {
          let customer = `<option value='{"id": ${cust._id}, "name": "${cust.name}"}'>${cust.name}</option>`;
          $("#customer").append(customer);
        });

        //  $('#customer').chosen();
      });
    }

    let allInstitutes = [];
    let filterInstituteId = 0;

    function loadInstitutes() {
      $.get(api + "institutes/all", function (data) {
        allInstitutes = data;

        // Populate filter dropdown
        $("#filter_institute").html(
          `<option value="0">All Institutes</option>`
        );
        $("#filter_institute_products").html(
          `<option value="0">All Institutes</option>`
        );
        data.forEach((institute) => {
          $("#filter_institute").append(
            `<option value="${institute.id}">${institute.name}</option>`
          );
          $("#filter_institute_products").append(
            `<option value="${institute.id}">${institute.name}</option>`
          );
        });

        // Populate category institute dropdown
        $("#category_institute").html(
          `<option value="">Select Institute</option>`
        );
        data.forEach((institute) => {
          $("#category_institute").append(
            `<option value="${institute.id}">${institute.name}</option>`
          );
        });
      });
    }

    // Load products view with separate search and filter
    function loadProductsView() {
      let currentFilterInstitute =
        parseInt($("#filter_institute_products").val()) || 0;

      let displayProducts = allProducts;
      let displayCategories = allCategories;

      if (currentFilterInstitute > 0) {
        displayProducts = allProducts.filter(
          (product) => product.institute_id == currentFilterInstitute
        );
        displayCategories = allCategories.filter(
          (cat) => cat.institute_id == currentFilterInstitute
        );
      }

      $("#parent_products").text("");
      $("#categories_products").html(
        `<button type="button" data-category="all" class="btn btn-categories btn-white waves-effect waves-light active">All</button> `
      );

      let productCategories = [];
      displayProducts.forEach((item) => {
        if (!productCategories.includes(item.category)) {
          productCategories.push(item.category);
        }

        const skuDisplay = item.sku || item._id || "";

        let item_info = `<div class="box ${item.category}"
                              onclick="$(this).addToCart(${item._id}, ${
          item.quantity
        }, ${item.stock})">
                          <div class="widget-panel widget-style-2 ">                    
                                      <div class="text-muted m-t-5 text-center">
                                      <div class="name" id="product_name" style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 8px;">${
                                        item.name
                                      }</div> 
                                      <span class="sku" style="font-size: 12px; color: #666;">ID: ${skuDisplay}</span>
                                      <div style="margin-top: 10px;">
                                        <span class="stock" style="font-size: 11px; color: #999;">STOCK: </span>
                                        <span class="count" style="font-size: 13px; font-weight: 500; color: ${
                                          item.stock == 1 && item.quantity <= 5
                                            ? "#f56954"
                                            : "#00a65a"
                                        }">${
          item.stock == 1 ? item.quantity : "N/A"
        }</span>
                                      </div>
                                      </div>
                                       <sp class="text-success text-center" style="display: block; margin-top: 12px; font-size: 18px;"><b data-plugin="counterup">${
                                         (settings && settings.symbol
                                           ? settings.symbol
                                           : "$") + item.price
                                       }</b> </sp>
                          </div>
                      </div>`;
        $("#parent_products").append(item_info);
      });

      productCategories.forEach((category) => {
        let c = displayCategories.filter(function (ctg) {
          return ctg._id == category;
        });
        if (c.length > 0) {
          $("#categories_products").append(
            `<button type="button" data-category="${category}" class="btn btn-categories btn-white waves-effect waves-light">${c[0].name}</button> `
          );
        }
      });

      displayCategories.forEach((category) => {
        if (!productCategories.includes(category._id)) {
          $("#categories_products").append(
            `<button type="button" data-category="${category._id}" class="btn btn-categories btn-white waves-effect waves-light">${category.name}</button> `
          );
        }
      });
    }

    function loadInstituteList() {
      let counter = 0;
      let institute_list = "";
      $("#institute_list").empty();
      $("#instituteList").DataTable().destroy();

      allInstitutes.forEach((institute, index) => {
        counter++;
        institute_list += `<tr>
            <td>${institute.name}</td>
            <td>${institute.district}</td>
            <td>${institute.zone}</td>
            <td><span class="btn-group"><button onClick="$(this).editInstitute(${index})" class="btn btn-warning"><i class="fa fa-edit"></i></button><button onClick="$(this).deleteInstitute(${institute.id})" class="btn btn-danger"><i class="fa fa-trash"></i></button></span></td></tr>`;
      });

      if (counter == allInstitutes.length) {
        $("#institute_list").html(institute_list);
        $("#instituteList").DataTable({
          autoWidth: false,
          info: true,
          JQueryUI: true,
          ordering: true,
          paging: false,
        });
      }
    }

    $.fn.editInstitute = function (index) {
      // Prevent cashiers from editing institutes
      if (user.role === "cashier" || user.role === "user") {
        Swal.fire(
          "Access Denied",
          "Cashiers cannot edit institutes",
          "warning"
        );
        return;
      }
      $("#Institutes").modal("hide");
      $("#instituteName").val(allInstitutes[index].name);
      $("#instituteDistrict").val(allInstitutes[index].district);
      $("#instituteZone").val(allInstitutes[index].zone);
      $("#institute_id").val(allInstitutes[index].id);
      $("#newInstitute").modal("show");
    };

    $.fn.deleteInstitute = function (id) {
      // Prevent cashiers from deleting institutes
      if (user.role === "cashier" || user.role === "user") {
        Swal.fire(
          "Access Denied",
          "Cashiers cannot delete institutes",
          "warning"
        );
        return;
      }
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this institute.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          $.ajax({
            url: api + "institutes/institute/" + id,
            type: "DELETE",
            success: function (result) {
              loadInstitutes();
              loadCategories(function () {
                loadProducts();
              });
              Swal.fire("Done!", "Institute deleted", "success");
            },
          });
        }
      });
    };

    $.fn.addToCart = function (id, count, stock) {
      if (stock == 1) {
        if (count > 0) {
          $.get(api + "inventory/product/" + id, function (data) {
            $(this).addProductToCart(data);
          });
        } else {
          Swal.fire(
            "Out of stock!",
            "This item is currently unavailable",
            "info"
          );
        }
      } else {
        $.get(api + "inventory/product/" + id, function (data) {
          $(this).addProductToCart(data);
        });
      }
    };

    // Live search functionality for products
    $("#skuCode").on("input", function () {
      let searchValue = $(this).val().trim().toLowerCase();

      if (searchValue.length < 1) {
        $("#searchResults").hide().empty();
        return;
      }

      // Get products to search from (filtered by institute if selected)
      let productsToSearch = allProducts;
      if (filterInstituteId > 0) {
        productsToSearch = allProducts.filter(
          (product) => product.institute_id == filterInstituteId
        );
      }

      // Filter products that match the search term
      let matchingProducts = productsToSearch.filter(function (product) {
        let productName = product.name.toLowerCase();
        let productId = product._id.toString();
        return (
          productName.includes(searchValue) || productId.includes(searchValue)
        );
      });

      // Sort results: exact ID matches first, then exact name matches, then partial matches
      matchingProducts.sort(function (a, b) {
        let aId = a._id.toString();
        let bId = b._id.toString();
        let aName = a.name.toLowerCase();
        let bName = b.name.toLowerCase();

        // Exact ID match gets highest priority
        if (aId === searchValue && bId !== searchValue) return -1;
        if (bId === searchValue && aId !== searchValue) return 1;

        // ID starts with search value
        if (aId.startsWith(searchValue) && !bId.startsWith(searchValue))
          return -1;
        if (bId.startsWith(searchValue) && !aId.startsWith(searchValue))
          return 1;

        // Exact name match
        if (aName === searchValue && bName !== searchValue) return -1;
        if (bName === searchValue && aName !== searchValue) return 1;

        // Name starts with search value
        if (aName.startsWith(searchValue) && !bName.startsWith(searchValue))
          return -1;
        if (bName.startsWith(searchValue) && !aName.startsWith(searchValue))
          return 1;

        // Default sort by ID
        return a._id - b._id;
      });

      if (matchingProducts.length > 0) {
        $("#searchResults").empty().show();

        // Limit to first 10 results
        matchingProducts.slice(0, 10).forEach(function (product) {
          let resultItem = $("<div>", {
            class: "search-result-item",
            style:
              "padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;",
            html:
              "<strong>" +
              product.name +
              "</strong><br><small>ID: " +
              product._id +
              " | Price: " +
              (settings && settings.symbol ? settings.symbol : "PKR") +
              product.price +
              " | Stock: " +
              product.quantity +
              "</small>",
          });

          resultItem.hover(
            function () {
              $(this).css("background-color", "#f5f5f5");
            },
            function () {
              $(this).css("background-color", "white");
            }
          );

          resultItem.on("click", function () {
            addProductToCartById(product._id);
            $("#skuCode").val("");
            $("#searchResults").hide().empty();
          });

          $("#searchResults").append(resultItem);
        });
      } else {
        $("#searchResults")
          .html(
            "<div style='padding: 10px; color: #999;'>No products found</div>"
          )
          .show();
      }
    });

    // Hide search results when clicking outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest("#skuCode, #searchResults").length) {
        $("#searchResults").hide();
      }
    });

    // Function to add product to cart by ID
    function addProductToCartById(productId) {
      $("#basic-addon2").empty();
      $("#basic-addon2").append($("<i>", { class: "fa fa-spinner fa-spin" }));

      $.ajax({
        url: api + "inventory/product/sku",
        type: "POST",
        data: JSON.stringify({ skuCode: productId.toString() }),
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: function (data) {
          if (data && data._id != undefined && data.quantity >= 1) {
            // Add product to cart
            let item = {
              id: data._id,
              product_name: data.name,
              sku: data._id,
              price: data.price,
              quantity: 1,
            };

            // Check if item already exists in cart
            let existingIndex = -1;
            $.each(cart, function (idx, cartItem) {
              if (cartItem.id == item.id) {
                existingIndex = idx;
                return false;
              }
            });

            if (existingIndex >= 0) {
              // Increment quantity if already in cart
              cart[existingIndex].quantity++;
            } else {
              // Add new item to cart
              cart.push(item);
            }

            // Render the cart table
            $(document).renderTable(cart);

            $("#basic-addon2").empty();
            $("#basic-addon2").append(
              $("<i>", { class: "glyphicon glyphicon-ok" })
            );

            Swal.fire({
              icon: "success",
              title: "Product Added!",
              text: data.name + " added to cart",
              timer: 1500,
              showConfirmButton: false,
            });
          } else if (data && data.quantity < 1) {
            Swal.fire(
              "Out of stock!",
              "This item is currently unavailable",
              "info"
            );
            $("#basic-addon2").empty();
            $("#basic-addon2").append(
              $("<i>", { class: "glyphicon glyphicon-remove" })
            );
          } else {
            Swal.fire("Not Found!", "Product not found!", "warning");
            $("#basic-addon2").empty();
            $("#basic-addon2").append(
              $("<i>", { class: "glyphicon glyphicon-remove" })
            );
          }
        },
        error: function (xhr, status, error) {
          console.error("Search error:", xhr, status, error);
          Swal.fire(
            "Error",
            "Could not add product. Please try again.",
            "error"
          );
          $("#basic-addon2").empty();
          $("#basic-addon2").append(
            $("<i>", { class: "glyphicon glyphicon-warning-sign" })
          );
        },
      });
    }

    function barcodeSearch(e) {
      e.preventDefault();
      $("#basic-addon2").empty();
      $("#basic-addon2").append($("<i>", { class: "fa fa-spinner fa-spin" }));

      let searchValue = $("#skuCode").val().trim();
      if (!searchValue) {
        $("#basic-addon2").empty();
        $("#basic-addon2").append(
          $("<i>", { class: "glyphicon glyphicon-remove" })
        );
        return;
      }

      let req = {
        skuCode: searchValue,
      };

      $.ajax({
        url: api + "inventory/product/sku",
        type: "POST",
        data: JSON.stringify(req),
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: function (data) {
          if (data && data._id != undefined && data.quantity >= 1) {
            // Add product to cart
            let item = {
              id: data._id,
              product_name: data.name,
              sku: data._id,
              price: data.price,
              quantity: 1,
            };

            // Check if item already exists in cart
            let existingIndex = -1;
            $.each(cart, function (idx, cartItem) {
              if (cartItem.id == item.id) {
                existingIndex = idx;
                return false;
              }
            });

            if (existingIndex >= 0) {
              // Increment quantity if already in cart
              cart[existingIndex].quantity++;
            } else {
              // Add new item to cart
              cart.push(item);
            }

            // Render the cart table
            $(document).renderTable(cart);

            $("#searchBarCode").get(0).reset();
            $("#basic-addon2").empty();
            $("#basic-addon2").append(
              $("<i>", { class: "glyphicon glyphicon-ok" })
            );

            Swal.fire({
              icon: "success",
              title: "Product Added!",
              text: data.name + " added to cart",
              timer: 1500,
              showConfirmButton: false,
            });
          } else if (data && data.quantity < 1) {
            Swal.fire(
              "Out of stock!",
              "This item is currently unavailable",
              "info"
            );
            $("#searchBarCode").get(0).reset();
            $("#basic-addon2").empty();
            $("#basic-addon2").append(
              $("<i>", { class: "glyphicon glyphicon-remove" })
            );
          } else {
            Swal.fire(
              "Not Found!",
              "Product with ID <b>" + searchValue + "</b> not found!",
              "warning"
            );

            $("#searchBarCode").get(0).reset();
            $("#basic-addon2").empty();
            $("#basic-addon2").append(
              $("<i>", { class: "glyphicon glyphicon-remove" })
            );
          }
        },
        error: function (xhr, status, error) {
          console.error("Search error:", xhr, status, error);
          console.error("Response:", xhr.responseText);
          Swal.fire(
            "Error",
            "Could not search for product. Please try again.",
            "error"
          );
          $("#basic-addon2").empty();
          $("#basic-addon2").append(
            $("<i>", { class: "glyphicon glyphicon-warning-sign" })
          );
        },
      });
    }

    $("#searchBarCode").on("submit", function (e) {
      barcodeSearch(e);
    });

    $("body").on("click", "#jq-keyboard button", function (e) {
      let pressed = $(this)[0].className.split(" ");
      if ($("#skuCode").val() != "" && pressed[2] == "enter") {
        barcodeSearch(e);
      }
    });

    $.fn.addProductToCart = function (data) {
      item = {
        id: data._id,
        product_name: data.name,
        sku: data.sku,
        price: data.price,
        quantity: 1,
      };

      if ($(this).isExist(item)) {
        $(this).qtIncrement(index);
      } else {
        cart.push(item);
        $(this).renderTable(cart);
      }
    };

    $.fn.isExist = function (data) {
      let toReturn = false;
      $.each(cart, function (index, value) {
        if (value.id == data.id) {
          $(this).setIndex(index);
          toReturn = true;
        }
      });
      return toReturn;
    };

    $.fn.setIndex = function (value) {
      index = value;
    };

    $.fn.calculateCart = function () {
      let total = 0;
      let grossTotal;
      $("#total").text(cart.length);
      $.each(cart, function (index, data) {
        total += data.quantity * data.price;
      });

      // Apply discount
      let discount = parseFloat($("#inputDiscount").val()) || 0;
      total = total - discount;

      $("#price").text(
        (settings && settings.symbol ? settings.symbol : "$") + total.toFixed(2)
      );

      subTotal = total;

      if (discount >= total + discount) {
        $("#inputDiscount").val(0);
      }

      // Calculate tax - use custom tax input if provided, otherwise use settings
      let taxRate = parseFloat($("#inputTax").val()) || 0;
      if (taxRate === 0 && settings.charge_tax) {
        taxRate = vat;
      }

      if (taxRate > 0) {
        totalVat = (total * taxRate) / 100;
        grossTotal = total + totalVat;
      } else {
        totalVat = 0;
        grossTotal = total;
      }

      orderTotal = grossTotal.toFixed(2);

      $("#gross_price").text(
        (settings && settings.symbol ? settings.symbol : "$") +
          grossTotal.toFixed(2)
      );
      $("#payablePrice").val(grossTotal);

      // Recalculate change when cart total changes
      $.fn.calculateChange();
    };

    $.fn.calculateChange = function () {
      let grossPrice =
        parseFloat(
          $("#gross_price")
            .text()
            .replace(/[^0-9.]/g, "")
        ) || 0;
      let paidAmount = parseFloat($("#inputPaid").val()) || 0;
      let change = paidAmount - grossPrice;

      // Display change (0 if negative)
      $("#change_amount").text(
        (settings && settings.symbol ? settings.symbol : "$") +
          (change > 0 ? change.toFixed(2) : "0.00")
      );

      // Color code: green if change, red if insufficient
      if (change >= 0) {
        $("#change_amount").css("color", "#28a745");
      } else {
        $("#change_amount").css("color", "#dc3545");
      }
    };

    $.fn.renderTable = function (cartList) {
      $("#cartTable > tbody").empty();
      $(this).calculateCart();
      $.each(cartList, function (index, data) {
        $("#cartTable > tbody").append(
          $("<tr>").append(
            $("<td>", { text: index + 1 }),
            $("<td>", { text: data.product_name }),
            $("<td>").append(
              $("<div>", { class: "input-group" }).append(
                $("<div>", { class: "input-group-btn btn-xs" }).append(
                  $("<button>", {
                    class: "btn btn-default btn-xs",
                    onclick: "$(this).qtDecrement(" + index + ")",
                  }).append($("<i>", { class: "fa fa-minus" }))
                ),
                $("<input>", {
                  class: "form-control",
                  type: "number",
                  value: data.quantity,
                  style: "width: 60px; text-align: center;",
                  onInput: "$(this).qtInput(" + index + ")",
                }),
                $("<div>", { class: "input-group-btn btn-xs" }).append(
                  $("<button>", {
                    class: "btn btn-default btn-xs",
                    onclick: "$(this).qtIncrement(" + index + ")",
                  }).append($("<i>", { class: "fa fa-plus" }))
                )
              )
            ),
            $("<td>", {
              text:
                (settings && settings.symbol ? settings.symbol : "$") +
                (data.price * data.quantity).toFixed(2),
            }),
            $("<td>").append(
              $("<button>", {
                class: "btn btn-danger btn-xs",
                onclick: "$(this).deleteFromCart(" + index + ")",
              }).append($("<i>", { class: "fa fa-times" }))
            )
          )
        );
      });
    };

    $.fn.deleteFromCart = function (index) {
      cart.splice(index, 1);
      $(this).renderTable(cart);
    };

    $.fn.qtIncrement = function (i) {
      item = cart[i];

      let product = allProducts.filter(function (selected) {
        return selected._id == parseInt(item.id);
      });

      if (product[0].stock == 1) {
        if (item.quantity < product[0].quantity) {
          item.quantity += 1;
          $(this).renderTable(cart);
        } else {
          Swal.fire(
            "No more stock!",
            "You have already added all the available stock.",
            "info"
          );
        }
      } else {
        item.quantity += 1;
        $(this).renderTable(cart);
      }
    };

    $.fn.qtDecrement = function (i) {
      if (item.quantity > 1) {
        item = cart[i];
        item.quantity -= 1;
        $(this).renderTable(cart);
      }
    };

    $.fn.qtInput = function (i) {
      item = cart[i];
      item.quantity = $(this).val();
      $(this).renderTable(cart);
    };

    $.fn.cancelOrder = function () {
      if (cart.length > 0) {
        Swal.fire({
          title: "Are you sure?",
          text: "You are about to remove all items from the cart.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, clear it!",
        }).then((result) => {
          if (result.value) {
            cart = [];
            $(this).renderTable(cart);
            holdOrder = 0;

            Swal.fire("Cleared!", "All items have been removed.", "success");
          }
        });
      }
    };

    $("#payButton").on("click", function () {
      if (cart.length != 0) {
        // Directly show invoice without payment processing
        generateAndShowInvoice();
      } else {
        Swal.fire("Oops!", "There is nothing to pay!", "warning");
      }
    });

    function generateAndShowInvoice() {
      // Get current values
      let discount = $("#inputDiscount").val() || 0;
      let customerData = $("#customer").val();
      let customer = { id: 0, name: "Walk in Customer" };

      try {
        if (customerData) {
          customer = JSON.parse(customerData);
        }
      } catch (e) {
        customer = { id: 0, name: "Walk in Customer" };
      }

      let currentTime = new Date(moment());
      let date = moment(currentTime).format("MMM DD, YYYY hh:mm A");

      // Calculate totals
      let subTotal = 0;
      cart.forEach((item) => {
        subTotal += parseFloat(item.price) * parseInt(item.quantity);
      });

      // Get tax rate from input or settings
      let taxRate = parseFloat($("#inputTax").val()) || 0;
      if (taxRate === 0 && settings && settings.charge_tax && vat > 0) {
        taxRate = vat;
      }

      let totalVat = taxRate > 0 ? (subTotal * taxRate) / 100 : 0;
      let grossTotal = subTotal + totalVat - parseFloat(discount);

      // Set payment as full amount (cash payment)
      let paid = grossTotal;
      let change = 0;
      let orderTotal = grossTotal;

      // Get currency symbol
      let currency = settings && settings.symbol ? settings.symbol : "PKR ";

      // Get company info with defaults
      let companyName =
        settings && settings.company_name
          ? settings.company_name
          : "Creative Hands By Tevta";
      let companyAddress = settings && settings.address ? settings.address : "";
      let companyContact = settings && settings.contact ? settings.contact : "";
      let companyFooter =
        settings && settings.footer
          ? settings.footer
          : "Thank you for your business!";

      // Make a copy of cart before clearing
      let cartCopy = JSON.parse(JSON.stringify(cart));

      // Prepare transaction data for database
      let transactionData = {
        ref_number: "",
        customer: customer.id,
        customer_name: customer.name,
        total: parseFloat(orderTotal).toFixed(2),
        discount: parseFloat(discount),
        tax: parseFloat(totalVat),
        payment_method: "Cash",
        payment_status: "Paid",
        status: 1,
        items: cartCopy,
        user_id: user._id || null,
        paid: parseFloat(paid).toFixed(2),
      };

      // Save transaction to database first to get the order number
      $.ajax({
        url: api + "transactions/new",
        type: "POST",
        data: JSON.stringify(transactionData),
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: function (response) {
          console.log("Transaction saved successfully", response);

          // Use the returned ID as order number
          let orderNumber = response.id;

          // Generate receipt HTML with the actual order number
          let items = "";
          cartCopy.forEach((item) => {
            let itemTotal = parseFloat(item.price) * parseInt(item.quantity);
            items += `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 8px;">${item.product_name}</td>
                <td style="padding: 12px 8px; text-align: center;">${
                  item.quantity
                }</td>
                <td style="padding: 12px 8px; text-align: right;">${currency}${itemTotal.toFixed(
              2
            )}</td>
              </tr>`;
          });

          let receipt = `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; background: #fff;">                            
            <!-- Header Section -->
            <div style="padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img style="max-width: 300px; max-height: 120px; width: auto; height: auto;" src="assets/images/logo.jpeg" alt="Logo" onerror="this.style.display='none'" />
                </div>
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 24px; color: #333; font-weight: 700;">${companyName}</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${
                  companyAddress || ""
                }</p>
                <p style="margin: 0; font-size: 12px; color: #666;">${
                  companyContact || ""
                }</p>
            </div>
            <h1 style="margin: 0; font-size: 42px; color: #000; font-weight: 700; text-align: center;">INVOICE</h1>
        </div>

        <!-- Client and Invoice Details -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div style="flex: 1;">
                <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 14px; color: #000;">Bill to:</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">${
                  customer.name || "Walk in Customer"
                }</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Customer</p>
            </div>
            <div style="text-align: right;">
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Order #</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${orderNumber}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Date</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${date}</p>
                </div>
                <div>
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Cashier</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${
                      user.fullname || "Administrator"
                    }</p>
                </div>
            </div>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
                <tr style="border-bottom: 2px solid #000;">
                    <th style="text-align: left; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">ITEMS</th>
                    <th style="text-align: center; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">QTY</th>
                    <th style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">PRICE</th>
                    <th style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                ${cart
                  .map(
                    (item) => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 8px; font-size: 12px; color: #333;">${
                      item.product_name
                    }</td>
                    <td style="text-align: center; padding: 12px 8px; font-size: 12px; color: #333;">${
                      item.quantity
                    }</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; color: #333;">${parseFloat(
                      item.price
                    ).toFixed(2)}</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; color: #333; font-weight: 600;">${(
                      item.quantity * parseFloat(item.price)
                    ).toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
                
                <tr style="border-top: 2px solid #ddd;">
                    <td colspan="3" style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 600;">Subtotal:</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 600;">${subTotal.toFixed(
                      2
                    )}</td>
                </tr>
                ${
                  discount > 0
                    ? `
                <tr>
                    <td colspan="3" style="text-align: right; padding: 8px; font-size: 12px;">Discount:</td>
                    <td style="text-align: right; padding: 8px; font-size: 12px;">${parseFloat(
                      discount
                    ).toFixed(2)}</td>
                </tr>
                `
                    : ""
                }
                ${
                  taxRate > 0
                    ? `
                <tr>
                    <td colspan="3" style="text-align: right; padding: 8px; font-size: 12px;">Tax (${taxRate}%):</td>
                    <td style="text-align: right; padding: 8px; font-size: 12px;">${parseFloat(
                      totalVat
                    ).toFixed(2)}</td>
                </tr>
                `
                    : ""
                }
            </tbody>
        </table>

        <!-- Notes and Total Section -->
        <div style="display: flex; justify-content: space-between; padding: 20px; border-radius: 8px;">
            <div style="flex: 1; padding-right: 20px;">
                <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 14px; color: #000;">Notes:</p>
                <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.6;">${
                  companyFooter || "Thank you for your business!"
                }</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #000;">TOTAL</p>
                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #000;">${parseFloat(
                  orderTotal
                ).toFixed(2)}</p>
            </div>
        </div>
        
        <!-- Customer Instructions - Full Width -->
        <div style="margin-top: 20px; padding: 20px; background: #f0f0f0; border-radius: 5px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #000; text-align: center;">Customer Instructions</p>
            <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.8; text-align: left;">• Please verify all items before leaving<br>• Returns accepted within 7 days with receipt<br>• For any queries, contact customer service</p>
        </div>
    </div>`;

          // Clear cart and show invoice
          cart = [];

          // Show invoice in modal
          $("#viewTransaction").html("");
          $("#viewTransaction").html(receipt);
          $("#orderModal").modal("show");

          // Reload and reset
          $(document).renderTable(cart);

          // Reset form
          $("#inputDiscount").val("");
          $("#inputTax").val("");
          $("#customer").val('{"id": 0, "name": "Walk in customer"}');

          // Reload transactions if on transactions page
          if (typeof loadTransactions === "function") {
            setTimeout(function () {
              loadTransactions();
            }, 500);
          }
        },
        error: function (xhr, status, error) {
          console.error("Failed to save transaction:", error);
          console.error("Response:", xhr.responseText);
          console.error("Status:", status);
        },
      });
    }

    $("#hold").on("click", function () {
      if (cart.length != 0) {
        $("#dueModal").modal("toggle");
      } else {
        Swal.fire("Oops!", "There is nothing to hold!", "warning");
      }
    });

    function printJobComplete() {
      alert("print job complete");
    }

    $.fn.submitDueOrder = function (status) {
      let items = "";
      let payment = 0;

      cart.forEach((item) => {
        items +=
          "<tr><td>" +
          item.product_name +
          "</td><td>" +
          item.quantity +
          "</td><td>" +
          settings.symbol +
          parseFloat(item.price).toFixed(2) +
          "</td></tr>";
      });

      let currentTime = new Date(moment());

      let discount = $("#inputDiscount").val();
      let customer = JSON.parse($("#customer").val());
      let date = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");
      let paid =
        $("#payment").val() == ""
          ? ""
          : parseFloat($("#payment").val()).toFixed(2);
      let change =
        $("#change").text() == ""
          ? ""
          : parseFloat($("#change").text()).toFixed(2);
      let refNumber = $("#refNumber").val();
      let orderNumber = holdOrder;
      let type = "";
      let tax_row = "";

      switch (paymentType) {
        case 1:
          type = "Cheque";
          break;

        case 2:
          type = "Card";
          break;

        default:
          type = "Cash";
      }

      if (paid != "") {
        payment = `<tr>
                        <td>Paid</td>
                        <td>:</td>
                        <td>${settings.symbol + paid}</td>
                    </tr>
                    <tr>
                        <td>Change</td>
                        <td>:</td>
                        <td>${
                          settings.symbol + Math.abs(change).toFixed(2)
                        }</td>
                    </tr>
                    <tr>
                        <td>Method</td>
                        <td>:</td>
                        <td>${type}</td>
                    </tr>`;
      }

      if (settings.charge_tax) {
        tax_row = `<tr>
                    <td>Vat(${settings.percentage})% </td>
                    <td>:</td>
                    <td>${settings.symbol}${parseFloat(totalVat).toFixed(
          2
        )}</td>
                </tr>`;
      }

      if (status == 0) {
        if ($("#customer").val() == 0 && $("#refNumber").val() == "") {
          Swal.fire(
            "Reference Required!",
            "You either need to select a customer <br> or enter a reference!",
            "warning"
          );

          return;
        }
      }

      $(".loading").show();

      if (holdOrder != 0) {
        orderNumber = holdOrder;
        method = "PUT";
      } else {
        orderNumber = Math.floor(Date.now() / 1000);
        method = "POST";
      }

      receipt = `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; background: #fff;">                            
        <!-- Header Section -->
        <div style="background: linear-gradient(to right, #f9f3e8, #f5e6d3); padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img style="max-width: 100px; max-height: 80px;" src="assets/images/logo.jpeg" alt="Logo" onerror="this.style.display='none'" />
            </div>
            <div style="text-align: right; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 16px; color: #333; font-weight: 600;">${
                  settings.store
                }</h2>
                ${
                  settings.address_one
                    ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${settings.address_one}</p>`
                    : ""
                }
                ${
                  settings.address_two
                    ? `<p style="margin: 0; font-size: 12px; color: #666;">${settings.address_two}</p>`
                    : ""
                }
                ${
                  settings.contact
                    ? `<p style="margin: 0; font-size: 12px; color: #666;">Tel: ${settings.contact}</p>`
                    : ""
                }
                ${
                  settings.tax
                    ? `<p style="margin: 0; font-size: 12px; color: #666;">Tax ID: ${settings.tax}</p>`
                    : ""
                }
            </div>
            <h1 style="margin: 0; font-size: 42px; color: #000; font-weight: 700;">INVOICE</h1>
        </div>

        <!-- Client and Invoice Details -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div style="flex: 1;">
                <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 14px; color: #000;">Bill to:</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">${
                  customer == 0 ? "Walk in Customer" : customer.name
                }</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Customer</p>
            </div>
            <div style="text-align: right;">
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Order #</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${orderNumber}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Date</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${date}</p>
                </div>
                <div>
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Cashier</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${
                      user.fullname
                    }</p>
                </div>
            </div>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
                <tr style="border-bottom: 2px solid #000; background: #f5f5f5;">
                    <th style="text-align: left; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">ITEMS</th>
                    <th style="text-align: center; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">QTY</th>
                    <th style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">PRICE</th>
                    <th style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                ${cart
                  .map(
                    (item) => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 8px; font-size: 12px; color: #333;">${
                      item.product_name
                    }</td>
                    <td style="text-align: center; padding: 12px 8px; font-size: 12px; color: #333;">${
                      item.quantity
                    }</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; color: #333;">${
                      settings.symbol
                    }${parseFloat(item.price).toFixed(2)}</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; color: #333; font-weight: 600;">${
                      settings.symbol
                    }${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
                
                <tr style="border-top: 2px solid #ddd;">
                    <td colspan="3" style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 600;">Subtotal:</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 600;">${
                      settings.symbol
                    }${subTotal.toFixed(2)}</td>
                </tr>
                ${
                  discount > 0
                    ? `
                <tr>
                    <td colspan="3" style="text-align: right; padding: 8px; font-size: 12px;">Discount:</td>
                    <td style="text-align: right; padding: 8px; font-size: 12px;">${
                      settings.symbol
                    }${parseFloat(discount).toFixed(2)}</td>
                </tr>
                `
                    : ""
                }
                ${
                  totalVat > 0
                    ? `
                <tr>
                    <td colspan="3" style="text-align: right; padding: 8px; font-size: 12px;">Tax:</td>
                    <td style="text-align: right; padding: 8px; font-size: 12px;">${
                      settings.symbol
                    }${parseFloat(totalVat).toFixed(2)}</td>
                </tr>
                `
                    : ""
                }
            </tbody>
        </table>

        <!-- Notes and Total Section -->
        <div style="display: flex; justify-content: space-between; background: linear-gradient(to right, #f9f3e8, #fde8b8); padding: 20px; border-radius: 8px;">
            <div style="flex: 1; padding-right: 20px;">
                <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 14px; color: #000;">Notes:</p>
                <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.6;">${
                  settings.footer || "Thank you for your business!"
                }</p>
                ${
                  refNumber
                    ? `<p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">Ref: ${refNumber}</p>`
                    : ""
                }
            </div>
            <div style="text-align: right;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #000;">TOTAL</p>
                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #000;">${
                  settings.symbol
                }${parseFloat(orderTotal).toFixed(2)}</p>
            </div>
        </div>
        
        <!-- Customer Instructions - Full Width -->
        <div style="margin-top: 20px; padding: 20px; background: #f0f0f0; border-radius: 5px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #000; text-align: center;">Customer Instructions</p>
            <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.8; text-align: left;">• Please verify all items before leaving<br>• Returns accepted within 7 days with receipt<br>• For any queries, contact customer service</p>
        </div>
    </div>`;

      if (status == 3) {
        if (cart.length > 0) {
          printJS({ printable: receipt, type: "raw-html" });

          $(".loading").hide();
          return;
        } else {
          $(".loading").hide();
          return;
        }
      }

      let data = {
        order: orderNumber,
        ref_number: refNumber,
        discount: discount,
        customer: customer,
        status: status,
        subtotal: parseFloat(subTotal).toFixed(2),
        tax: totalVat,
        order_type: 1,
        items: cart,
        date: currentTime,
        payment_type: type,
        payment_info: $("#paymentInfo").val(),
        total: orderTotal,
        paid: paid,
        change: change,
        _id: orderNumber,
        till: platform.till,
        mac: platform.mac,
        user: user.fullname,
        user_id: user._id,
      };

      $.ajax({
        url: api + "new",
        type: method,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: function (data) {
          cart = [];
          $("#viewTransaction").html("");
          $("#viewTransaction").html(receipt);
          $("#orderModal").modal("show");
          loadProducts();
          loadCustomers();
          $(".loading").hide();
          $("#dueModal").modal("hide");
          $("#paymentModel").modal("hide");
          $(this).getHoldOrders();
          $(this).getCustomerOrders();
          $(this).renderTable(cart);
        },
        error: function (data) {
          $(".loading").hide();
          $("#dueModal").modal("toggle");
          swal(
            "Something went wrong!",
            "Please refresh this page and try again"
          );
        },
      });

      $("#refNumber").val("");
      $("#change").text("");
      $("#payment").val("");
    };

    $.get(api + "on-hold", function (data) {
      holdOrderList = data;
      holdOrderlocation.empty();
      clearInterval(dotInterval);
      $(this).randerHoldOrders(holdOrderList, holdOrderlocation, 1);
    });

    $.fn.getHoldOrders = function () {
      $.get(api + "on-hold", function (data) {
        holdOrderList = data;
        clearInterval(dotInterval);
        holdOrderlocation.empty();
        $(this).randerHoldOrders(holdOrderList, holdOrderlocation, 1);
      });
    };

    $.fn.randerHoldOrders = function (data, renderLocation, orderType) {
      $.each(data, function (index, order) {
        $(this).calculatePrice(order);
        renderLocation.append(
          $("<div>", {
            class:
              orderType == 1 ? "col-md-3 order" : "col-md-3 customer-order",
          }).append(
            $("<a>").append(
              $("<div>", { class: "card-box order-box" }).append(
                $("<p>").append(
                  $("<b>", { text: "Ref :" }),
                  $("<span>", { text: order.ref_number, class: "ref_number" }),
                  $("<br>"),
                  $("<b>", { text: "Price :" }),
                  $("<span>", {
                    text: order.total,
                    class: "label label-info",
                    style: "font-size:14px;",
                  }),
                  $("<br>"),
                  $("<b>", { text: "Items :" }),
                  $("<span>", { text: order.items.length }),
                  $("<br>"),
                  $("<b>", { text: "Customer :" }),
                  $("<span>", {
                    text:
                      order.customer != 0
                        ? order.customer.name
                        : "Walk in customer",
                    class: "customer_name",
                  })
                ),
                $("<button>", {
                  class: "btn btn-danger del",
                  onclick:
                    "$(this).deleteOrder(" + index + "," + orderType + ")",
                }).append($("<i>", { class: "fa fa-trash" })),

                $("<button>", {
                  class: "btn btn-default",
                  onclick:
                    "$(this).orderDetails(" + index + "," + orderType + ")",
                }).append($("<span>", { class: "fa fa-shopping-basket" }))
              )
            )
          )
        );
      });
    };

    $.fn.calculatePrice = function (data) {
      totalPrice = 0;
      $.each(data.products, function (index, product) {
        totalPrice += product.price * product.quantity;
      });

      let vat = (totalPrice * data.vat) / 100;
      totalPrice = (totalPrice + vat - data.discount).toFixed(0);

      return totalPrice;
    };

    $.fn.orderDetails = function (index, orderType) {
      $("#refNumber").val("");

      if (orderType == 1) {
        $("#refNumber").val(holdOrderList[index].ref_number);

        $("#customer option:selected").removeAttr("selected");

        $("#customer option")
          .filter(function () {
            return $(this).text() == "Walk in customer";
          })
          .prop("selected", true);

        holdOrder = holdOrderList[index]._id;
        cart = [];
        $.each(holdOrderList[index].items, function (index, product) {
          item = {
            id: product.id,
            product_name: product.product_name,
            sku: product.sku,
            price: product.price,
            quantity: product.quantity,
          };
          cart.push(item);
        });
      } else if (orderType == 2) {
        $("#refNumber").val("");

        $("#customer option:selected").removeAttr("selected");

        $("#customer option")
          .filter(function () {
            return $(this).text() == customerOrderList[index].customer.name;
          })
          .prop("selected", true);

        holdOrder = customerOrderList[index]._id;
        cart = [];
        $.each(customerOrderList[index].items, function (index, product) {
          item = {
            id: product.id,
            product_name: product.product_name,
            sku: product.sku,
            price: product.price,
            quantity: product.quantity,
          };
          cart.push(item);
        });
      }
      $(this).renderTable(cart);
      $("#holdOrdersModal").modal("hide");
      $("#customerModal").modal("hide");
    };

    $.fn.deleteOrder = function (index, type) {
      switch (type) {
        case 1:
          deleteId = holdOrderList[index]._id;
          break;
        case 2:
          deleteId = customerOrderList[index]._id;
      }

      let data = {
        orderId: deleteId,
      };

      Swal.fire({
        title: "Delete order?",
        text: "This will delete the order. Are you sure you want to delete!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          $.ajax({
            url: api + "delete",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
              $(this).getHoldOrders();
              $(this).getCustomerOrders();

              Swal.fire("Deleted!", "You have deleted the order!", "success");
            },
            error: function (data) {
              $(".loading").hide();
            },
          });
        }
      });
    };

    $.fn.getCustomerOrders = function () {
      $.get(api + "customer-orders", function (data) {
        clearInterval(dotInterval);
        customerOrderList = data;
        customerOrderLocation.empty();
        $(this).randerHoldOrders(customerOrderList, customerOrderLocation, 2);
      });
    };

    $("#saveCustomer").on("submit", function (e) {
      e.preventDefault();

      let custData = {
        _id: Math.floor(Date.now() / 1000),
        name: $("#userName").val(),
        phone: $("#phoneNumber").val(),
        email: $("#emailAddress").val(),
        address: $("#userAddress").val(),
      };

      $.ajax({
        url: api + "customers/customer",
        type: "POST",
        data: JSON.stringify(custData),
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: function (data) {
          $("#newCustomer").modal("hide");
          Swal.fire(
            "Customer added!",
            "Customer added successfully!",
            "success"
          );
          $("#customer option:selected").removeAttr("selected");
          $("#customer").append(
            $("<option>", {
              text: custData.name,
              value: `{"id": ${custData._id}, "name": "${custData.name}"}`,
              selected: "selected",
            })
          );

          $("#customer")
            .val(`{"id": ${custData._id}, "name": "${custData.name}"}`)
            .trigger("chosen:updated");
        },
        error: function (data) {
          $("#newCustomer").modal("hide");
          Swal.fire("Error", "Something went wrong please try again", "error");
        },
      });
    });

    $("#confirmPayment").hide();

    $("#cardInfo").hide();

    $("#payment").on("input", function () {
      $(this).calculateChange();
    });

    $("#confirmPayment").on("click", function () {
      if ($("#payment").val() == "") {
        Swal.fire("Nope!", "Please enter the amount that was paid!", "warning");
      } else {
        $(this).submitDueOrder(1);
      }
    });

    $("#backToDashboard").click(function () {
      // Show dashboard view
      $("#pos_view").show();
      $("#products_view").hide();
      $("#transactions_view").hide();

      // Show all navigation buttons
      $("#transactions").show();
      $("#productsSelection").show();
      $("#pointofsale").show();

      // Hide back button
      $(this).hide();
    });

    $("#transactions").click(function () {
      loadInstitutes();
      loadTransactions();
      loadUserList();

      $("#pos_view").hide();
      $("#products_view").hide();
      $("#pointofsale").show();
      $("#productsSelection").show();
      $("#transactions_view").show();
      $("#backToDashboard").show();
      $(this).hide();
    });

    $("#pointofsale").click(function () {
      $("#pos_view").show();
      $("#products_view").hide();
      $("#transactions").show();
      $("#productsSelection").show();
      $("#transactions_view").hide();
      $("#backToDashboard").hide();
      $(this).hide();
    });

    $("#productsSelection").click(function () {
      $("#products_view").show();
      $("#pos_view").hide();
      $("#transactions_view").hide();
      $("#transactions").show();
      $("#pointofsale").show();
      $("#backToDashboard").show();
      $(this).hide();

      // Load products in the products view
      loadProductsView();
    });

    $("#viewRefOrders").click(function () {
      setTimeout(function () {
        $("#holdOrderInput").focus();
      }, 500);
    });

    $("#viewCustomerOrders").click(function () {
      setTimeout(function () {
        $("#holdCustomerOrderInput").focus();
      }, 500);
    });

    $("#newProductModal").click(function () {
      $("#saveProduct").get(0).reset();

      // Populate institute dropdown
      let instituteOptions =
        '<option value="">Select Institute (Optional)</option>';
      allInstitutes.forEach((institute) => {
        instituteOptions += `<option value="${institute.id}">${institute.name}</option>`;
      });
      $("#product_institute").html(instituteOptions);

      // Populate all categories initially
      populateProductCategories("");

      // Remove any existing handlers and attach new one
      $("#product_institute")
        .off("change")
        .on("change", function () {
          const selectedInstituteId = $(this).val();
          console.log("Institute changed to:", selectedInstituteId);
          console.log("All categories:", allCategories);
          populateProductCategories(selectedInstituteId);
        });
    });

    $("#saveProduct").submit(function (e) {
      e.preventDefault();

      $(this).attr("action", api + "inventory/product");
      $(this).attr("method", "POST");

      $(this).ajaxSubmit({
        success: function (response) {
          $("#saveProduct").get(0).reset();

          // Reload categories first, then products
          loadCategories(function () {
            loadProducts();
          });
          Swal.fire({
            title: "Product Saved",
            text: "Select an option below to continue.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add another",
            cancelButtonText: "Close",
          }).then((result) => {
            if (!result.value) {
              $("#newProduct").modal("hide");
            }
          });
        },
        error: function (data) {
          console.log(data);
        },
      });
    });

    $("#saveCategory").submit(function (e) {
      e.preventDefault();

      if ($("#category_id").val() == "") {
        method = "POST";
      } else {
        method = "PUT";
      }

      $.ajax({
        type: method,
        url: api + "categories/category",
        data: $(this).serialize(),
        success: function (data, textStatus, jqXHR) {
          $("#saveCategory").get(0).reset();
          // Reload categories first, then products
          loadCategories(function () {
            loadProducts();
          });
          Swal.fire({
            title: "Category Saved",
            text: "Select an option below to continue.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add another",
            cancelButtonText: "Close",
          }).then((result) => {
            if (!result.value) {
              $("#newCategory").modal("hide");
            }
          });
        },
        error: function (data) {
          console.log(data);
        },
      });
    });

    $("#saveInstitute").submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "POST",
        url: api + "institutes/institute",
        data: $(this).serialize(),
        success: function (data, textStatus, jqXHR) {
          $("#saveInstitute").get(0).reset();
          loadInstitutes();
          Swal.fire({
            title: "Institute Saved",
            text: "Institute has been saved successfully.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add another",
            cancelButtonText: "Close",
          }).then((result) => {
            if (!result.value) {
              $("#newInstitute").modal("hide");
            }
          });
        },
        error: function (data) {
          console.log(data);
        },
      });
    });

    $.fn.editProduct = function (index) {
      // Prevent cashiers from editing products
      if (user.role === "cashier" || user.role === "user") {
        Swal.fire("Access Denied", "Cashiers cannot edit products", "warning");
        return;
      }
      $("#Products").modal("hide");

      // Populate institute dropdown
      let instituteOptions =
        '<option value="">Select Institute (Optional)</option>';
      allInstitutes.forEach((institute) => {
        instituteOptions += `<option value="${institute.id}">${institute.name}</option>`;
      });
      $("#product_institute").html(instituteOptions);

      // Set selected institute if product has one
      if (allProducts[index].institute_id) {
        $("#product_institute").val(allProducts[index].institute_id);
        // Populate categories filtered by this institute
        populateProductCategories(allProducts[index].institute_id);
      } else {
        // Populate all categories
        populateProductCategories("");
      }

      $("#category option")
        .filter(function () {
          return $(this).val() == allProducts[index].category;
        })
        .prop("selected", true);

      $("#productName").val(allProducts[index].name);
      $("#product_price").val(allProducts[index].price);
      $("#quantity").val(allProducts[index].quantity);

      $("#product_id").val(allProducts[index]._id);

      if (allProducts[index].stock == 0) {
        $("#stock").prop("checked", true);
      }

      $("#newProduct").modal("show");
    };

    $("#userModal").on("hide.bs.modal", function () {
      $(".perms").hide();
    });

    $.fn.editUser = function (index) {
      user_index = index;

      $("#Users").modal("hide");

      $(".perms").show();

      $("#user_id").val(allUsers[index]._id);
      $("#fullname").val(allUsers[index].fullname);
      $("#username").val(allUsers[index].username);
      $("#password").val(atob(allUsers[index].password));
      $("#userRole").val(allUsers[index].role || "cashier");

      if (allUsers[index].perm_products == 1) {
        $("#perm_products").prop("checked", true);
      } else {
        $("#perm_products").prop("checked", false);
      }

      if (allUsers[index].perm_categories == 1) {
        $("#perm_categories").prop("checked", true);
      } else {
        $("#perm_categories").prop("checked", false);
      }

      if (allUsers[index].perm_transactions == 1) {
        $("#perm_transactions").prop("checked", true);
      } else {
        $("#perm_transactions").prop("checked", false);
      }

      if (allUsers[index].perm_users == 1) {
        $("#perm_users").prop("checked", true);
      } else {
        $("#perm_users").prop("checked", false);
      }

      if (allUsers[index].perm_settings == 1) {
        $("#perm_settings").prop("checked", true);
      } else {
        $("#perm_settings").prop("checked", false);
      }

      $("#userModal").modal("show");
    };

    $.fn.editCategory = function (index) {
      // Prevent cashiers from editing categories
      if (user.role === "cashier" || user.role === "user") {
        Swal.fire(
          "Access Denied",
          "Cashiers cannot edit categories",
          "warning"
        );
        return;
      }
      $("#Categories").modal("hide");
      $("#categoryName").val(allCategories[index].name);
      $("#category_id").val(allCategories[index]._id);

      // Set institute dropdown
      if (allCategories[index].institute_id) {
        $("#category_institute").val(allCategories[index].institute_id);
      }

      $("#newCategory").modal("show");
    };

    $.fn.deleteProduct = function (id) {
      // Prevent cashiers from deleting products
      if (user.role === "cashier" || user.role === "user") {
        Swal.fire(
          "Access Denied",
          "Cashiers cannot delete products",
          "warning"
        );
        return;
      }
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this product.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          $.ajax({
            url: api + "inventory/product/" + id,
            type: "DELETE",
            success: function (result) {
              loadCategories(function () {
                loadProducts();
              });
              Swal.fire("Done!", "Product deleted", "success");
            },
          });
        }
      });
    };

    $.fn.deleteUser = function (id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this user.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete!",
      }).then((result) => {
        if (result.value) {
          $.ajax({
            url: api + "users/user/" + id,
            type: "DELETE",
            success: function (result) {
              loadUserList();
              Swal.fire("Done!", "User deleted", "success");
            },
          });
        }
      });
    };

    $.fn.deleteCategory = function (id) {
      // Prevent cashiers from deleting categories
      if (user.role === "cashier" || user.role === "user") {
        Swal.fire(
          "Access Denied",
          "Cashiers cannot delete categories",
          "warning"
        );
        return;
      }
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this category.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          $.ajax({
            url: api + "categories/category/" + id,
            type: "DELETE",
            success: function (result) {
              loadCategories(function () {
                loadProducts();
              });
              Swal.fire("Done!", "Category deleted", "success");
            },
          });
        }
      });
    };

    $("#productModal").click(function () {
      loadProductList();
    });

    $("#usersModal").click(function () {
      loadUserList();
    });

    $("#categoryModal").click(function () {
      loadCategoryList();
    });

    $("#instituteModal").click(function () {
      loadInstitutes();
      setTimeout(function () {
        loadInstituteList();
      }, 300);
    });

    $("#newInstituteModal").click(function () {
      $("#saveInstitute").get(0).reset();
    });

    $("#filter_institute").change(function () {
      filterInstituteId = parseInt($(this).val());
      console.log("Filter institute changed to:", filterInstituteId);
      console.log("All products:", allProducts.length);
      console.log("All categories:", allCategories.length);
      loadProducts();
    });

    $("#filter_institute_products").change(function () {
      loadProductsView();
    });

    // Product search functionality for products view
    $("#search_products").on("keyup", function () {
      let searchTerm = $(this).val().toLowerCase();
      $("#parent_products .box").each(function () {
        let productName = $(this).find("#product_name").text().toLowerCase();
        let sku = $(this).find(".sku").text().toLowerCase();
        if (productName.includes(searchTerm) || sku.includes(searchTerm)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });

    // Category filter for products view
    $(document).on("click", "#categories_products button", function () {
      $("#categories_products button").removeClass("active");
      $(this).addClass("active");
      let category = $(this).attr("data-category");

      if (category === "all") {
        $("#parent_products .box").show();
      } else {
        $("#parent_products .box").hide();
        $("#parent_products .box." + category).show();
      }
    });

    function loadUserList() {
      let counter = 0;
      let user_list = "";
      $("#user_list").empty();

      $.get(api + "users/all", function (users) {
        allUsers = [...users];

        // Check if DataTable exists before destroying
        if ($.fn.DataTable.isDataTable("#userList")) {
          $("#userList").DataTable().destroy();
        }

        users.forEach((user, index) => {
          state = [];
          let class_name = "";

          if (user.status != "") {
            state = user.status.split("_");

            switch (state[0]) {
              case "Logged In":
                class_name = "btn-default";
                break;
              case "Logged Out":
                class_name = "btn-light";
                break;
            }
          }

          counter++;
          user_list += `<tr>
            <td>${user.fullname}</td>
            <td>${user.username}</td>
            <td class="${class_name}">${
            state.length > 0 ? state[0] : ""
          } <br><span style="font-size: 11px;"> ${
            state.length > 0
              ? moment(state[1]).format("hh:mm A DD MMM YYYY")
              : ""
          }</span></td>
            <td>${
              user._id == 1
                ? '<span class="btn-group"><button class="btn btn-dark"><i class="fa fa-edit"></i></button><button class="btn btn-dark"><i class="fa fa-trash"></i></button></span>'
                : '<span class="btn-group"><button onClick="$(this).editUser(' +
                  index +
                  ')" class="btn btn-warning"><i class="fa fa-edit"></i></button><button onClick="$(this).deleteUser(' +
                  user._id +
                  ')" class="btn btn-danger"><i class="fa fa-trash"></i></button></span>'
            }</td></tr>`;

          if (counter == users.length) {
            $("#user_list").html(user_list);

            $("#userList").DataTable({
              order: [[1, "desc"]],
              autoWidth: false,
              info: true,
              JQueryUI: true,
              ordering: true,
              paging: false,
            });
          }
        });
      });
    }

    function loadProductList() {
      let products = [...allProducts];
      let product_list = "";
      let counter = 0;
      $("#product_list").empty();

      // Check if DataTable exists before destroying
      if ($.fn.DataTable.isDataTable("#productList")) {
        $("#productList").DataTable().destroy();
      }

      products.forEach((product, index) => {
        counter++;

        let category = allCategories.filter(function (category) {
          return category._id == product.category;
        });

        product_list += `<tr>
            <td>${product.name}</td>
            <td>${settings && settings.symbol ? settings.symbol : "$"}${
          product.price
        }</td>
            <td>${product.stock == 1 ? product.quantity : "N/A"}</td>
            <td>${category.length > 0 ? category[0].name : ""}</td>
            <td class="nobr"><span class="btn-group"><button onClick="$(this).editProduct(${index})" class="btn btn-warning btn-sm"><i class="fa fa-edit"></i></button><button onClick="$(this).deleteProduct(${
          product._id
        })" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button></span></td></tr>`;

        if (counter == allProducts.length) {
          $("#product_list").html(product_list);

          $("#productList").DataTable({
            order: [[0, "desc"]],
            autoWidth: false,
            info: true,
            JQueryUI: true,
            ordering: true,
            paging: false,
          });
        }
      });
    }

    function loadCategoryList() {
      let category_list = "";
      let counter = 0;
      $("#category_list").empty();
      $("#categoryList").DataTable().destroy();

      allCategories.forEach((category, index) => {
        counter++;

        // Find institute name
        let instituteName = "N/A";
        if (
          category.institute_id &&
          typeof allInstitutes !== "undefined" &&
          allInstitutes
        ) {
          const institute = allInstitutes.find(
            (inst) => inst.id === category.institute_id
          );
          if (institute) {
            instituteName = institute.name;
          }
        }

        category_list += `<tr>
            <td>${category.name}</td>
            <td>${instituteName}</td>
            <td><span class="btn-group"><button onClick="$(this).editCategory(${index})" class="btn btn-warning"><i class="fa fa-edit"></i></button><button onClick="$(this).deleteCategory(${category._id})" class="btn btn-danger"><i class="fa fa-trash"></i></button></span></td></tr>`;
      });

      if (counter == allCategories.length) {
        $("#category_list").html(category_list);
        $("#categoryList").DataTable({
          autoWidth: false,
          info: true,
          JQueryUI: true,
          ordering: true,
          paging: false,
        });
      }
    }

    $.fn.serializeObject = function () {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function () {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || "");
        } else {
          o[this.name] = this.value || "";
        }
      });
      return o;
    };

    $("#log-out").click(function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to log out.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Logout",
      }).then((result) => {
        if (result.value) {
          $.get(api + "users/logout/" + user._id, function (data) {
            storage.delete("auth");
            storage.delete("user");
            ipcRenderer.send("app-reload", "");
          });
        }
      });
    });

    $("#settings_form").on("submit", function (e) {
      e.preventDefault();
      let formData = $(this).serializeObject();
      let mac_address;

      api = "http://" + host + ":" + port + "/api/";

      macaddress.one(function (err, mac) {
        mac_address = mac;
      });

      formData["app"] = $("#app").find("option:selected").text();
      formData["mac"] = mac_address;
      formData["till"] = 1;

      $("#settings_form").append(
        '<input type="hidden" name="app" value="' + formData.app + '" />'
      );

      if (formData.percentage != "" && !$.isNumeric(formData.percentage)) {
        Swal.fire(
          "Oops!",
          "Please make sure the tax value is a number",
          "warning"
        );
      } else {
        storage.set("settings", formData);

        $(this).attr("action", api + "settings/post");
        $(this).attr("method", "POST");

        $(this).ajaxSubmit({
          contentType: "application/json",
          success: function (response) {
            ipcRenderer.send("app-reload", "");
          },
          error: function (data) {
            console.log(data);
          },
        });
      }
    });

    $("#net_settings_form").on("submit", function (e) {
      e.preventDefault();
      let formData = $(this).serializeObject();

      if (formData.till == 0 || formData.till == 1) {
        Swal.fire("Oops!", "Please enter a number greater than 1.", "warning");
      } else {
        if (isNumeric(formData.till)) {
          formData["app"] = $("#app").find("option:selected").text();
          storage.set("settings", formData);
          ipcRenderer.send("app-reload", "");
        } else {
          Swal.fire("Oops!", "Till number must be a number!", "warning");
        }
      }
    });

    $("#saveUser").on("submit", function (e) {
      e.preventDefault();
      let formData = $(this).serializeObject();

      console.log(formData);

      if (ownUserEdit) {
        if (formData.password != atob(user.password)) {
          if (formData.password != formData.pass) {
            Swal.fire("Oops!", "Passwords do not match!", "warning");
          }
        }
      } else {
        if (formData.password != atob(allUsers[user_index].password)) {
          if (formData.password != formData.pass) {
            Swal.fire("Oops!", "Passwords do not match!", "warning");
          }
        }
      }

      if (
        formData.password == atob(user.password) ||
        formData.password == atob(allUsers[user_index].password) ||
        formData.password == formData.pass
      ) {
        $.ajax({
          url: api + "users/post",
          type: "POST",
          data: JSON.stringify(formData),
          contentType: "application/json; charset=utf-8",
          cache: false,
          processData: false,
          success: function (data) {
            if (ownUserEdit) {
              ipcRenderer.send("app-reload", "");
            } else {
              $("#userModal").modal("hide");

              loadUserList();

              $("#Users").modal("show");
              Swal.fire("Ok!", "User details saved!", "success");
            }
          },
          error: function (data) {
            console.log(data);
          },
        });
      }
    });

    $("#app").change(function () {
      if (
        $(this).find("option:selected").text() ==
        "Network Point of Sale Terminal"
      ) {
        $("#net_settings_form").show(500);
        $("#settings_form").hide(500);
        macaddress.one(function (err, mac) {
          $("#mac").val(mac);
        });
      } else {
        $("#net_settings_form").hide(500);
        $("#settings_form").show(500);
      }
    });

    $("#cashier").click(function () {
      ownUserEdit = true;

      $("#userModal").modal("show");

      $("#user_id").val(user._id);
      $("#fullname").val(user.fullname);
      $("#username").val(user.username);
      $("#password").val(atob(user.password));
      $("#userRole").val(user.role || "cashier");
      $(".role-selection").hide(); // Hide role selection for self-edit
      $(".perms").hide(); // Hide permissions for self-edit
    });

    $("#add-user").click(function () {
      if (platform && platform.app != "Network Point of Sale Terminal") {
        $(".perms").show();
      } else if (!platform) {
        $(".perms").show(); // Show perms by default if platform not set
      }

      $("#saveUser").get(0).reset();
      $("#userRole").val("cashier"); // Default to cashier
      $(".role-selection").show();
      $("#userModal").modal("show");
    });

    $("#settings").click(function () {
      if (platform.app == "Network Point of Sale Terminal") {
        $("#net_settings_form").show(500);
        $("#settings_form").hide(500);

        $("#ip").val(platform.ip);
        $("#till").val(platform.till);

        macaddress.one(function (err, mac) {
          $("#mac").val(mac);
        });

        $("#app option")
          .filter(function () {
            return $(this).text() == platform.app;
          })
          .prop("selected", true);
      } else {
        $("#net_settings_form").hide(500);
        $("#settings_form").show(500);

        $("#settings_id").val("1");
        $("#store").val(settings.store);
        $("#address_one").val(settings.address_one);
        $("#address_two").val(settings.address_two);
        $("#contact").val(settings.contact);
        $("#tax").val(settings.tax);
        $("#symbol").val(settings.symbol);
        $("#percentage").val(settings.percentage);
        $("#footer").val(settings.footer);
        $("#logo_img").val(settings.img);
        if (settings.charge_tax == "on") {
          $("#charge_tax").prop("checked", true);
        }
        if (settings.img != "") {
          $("#logoname").hide();
          $("#current_logo").html(
            `<img src="${img_path + settings.img}" alt="">`
          );
          $("#rmv_logo").show();
        }

        $("#app option")
          .filter(function () {
            return $(this).text() == settings.app;
          })
          .prop("selected", true);
      }
    });
  } // End of initializeApp function
}); // End of document.ready

$("#rmv_logo").click(function () {
  $("#remove_logo").val("1");
  $("#current_logo").hide(500);
  $(this).hide(500);
  $("#logoname").show(500);
});

$("#print_list").click(function () {
  $("#loading").show();

  $("#productList").DataTable().destroy();

  const filename = "productList.pdf";

  html2canvas($("#all_products").get(0)).then((canvas) => {
    let height = canvas.height * (25.4 / 96);
    let width = canvas.width * (25.4 / 96);
    let pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);

    $("#loading").hide();
    pdf.save(filename);
  });

  $("#productList").DataTable({
    order: [[1, "desc"]],
    autoWidth: false,
    info: true,
    JQueryUI: true,
    ordering: true,
    paging: false,
  });

  $(".loading").hide();
});

$.fn.print = function () {
  printJS({ printable: receipt, type: "raw-html" });
};

// Print invoice modal content
$("#printInvoiceBtn").click(function () {
  var printContent = document.getElementById("viewTransaction").innerHTML;
  var originalContent = document.body.innerHTML;

  // Create a temporary div with print-friendly styling
  var printWindow = window.open("", "_blank");
  printWindow.document.write("<html><head><title>Print Invoice</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(
    "body { font-family: Arial, sans-serif; margin: 20px; }"
  );
  printWindow.document.write(
    "table { width: 100%; border-collapse: collapse; margin: 10px 0; }"
  );
  printWindow.document.write(
    "table, th, td { border: 1px solid #ddd; padding: 8px; }"
  );
  printWindow.document.write(
    "th { background-color: #f2f2f2; text-align: left; }"
  );
  printWindow.document.write("@media print { body { margin: 0; } }");
  printWindow.document.write("</style></head><body>");
  printWindow.document.write(printContent);
  printWindow.document.write("</body></html>");
  printWindow.document.close();

  // Wait for content to load then print
  setTimeout(function () {
    printWindow.print();
    printWindow.close();
  }, 250);
});

function loadTransactions() {
  let tills = [];
  let users = [];
  let sales = 0;
  let transact = 0;
  let unique = 0;

  sold_items = [];
  sold = [];

  let counter = 0;
  let transaction_list = "";
  let query = `transactions/by-date?start=${start_date}&end=${end_date}&user=${by_user}&till=${by_till}&status=1`;

  $.get(api + query, function (transactions) {
    if (transactions.length > 0) {
      $("#transaction_list").empty();
      $("#transactionList").DataTable().destroy();

      allTransactions = [...transactions];

      transactions.forEach((trans, index) => {
        sales += parseFloat(trans.total);
        transact++;

        trans.items.forEach((item) => {
          sold_items.push(item);
        });

        if (!tills.includes(trans.till)) {
          tills.push(trans.till);
        }

        if (!users.includes(trans.user_id)) {
          users.push(trans.user_id);
        }

        counter++;
        transaction_list += `<tr>
                                <td>${trans.order}</td>
                                <td class="nobr">${moment(trans.date).format(
                                  "YYYY MMM DD hh:mm:ss"
                                )}</td>
                                <td>${settings.symbol + trans.total}</td>
                                <td>${
                                  trans.paid == ""
                                    ? ""
                                    : settings.symbol + trans.paid
                                }</td>
                                <td>${trans.payment_method || "Cash"}</td>
                                <td>${trans.user}</td>
                                <td>${
                                  trans.paid == ""
                                    ? '<button class="btn btn-dark"><i class="fa fa-search-plus"></i></button>'
                                    : '<button onClick="viewTransactionModal(' +
                                      index +
                                      ')" class="btn btn-info"><i class="fa fa-search-plus"></i></button></td>'
                                }</tr>
                    `;

        if (counter == transactions.length) {
          // Removed: populate totals in removed section

          const result = {};

          for (const {
            product_name,
            price,
            quantity,
            product_id,
          } of sold_items) {
            if (!result[product_name]) result[product_name] = [];
            result[product_name].push({ id: product_id, price, quantity });
          }

          for (item in result) {
            let price = 0;
            let quantity = 0;
            let id = 0;

            result[item].forEach((i) => {
              id = i.id;
              price = i.price;
              quantity += i.quantity;
            });

            sold.push({
              id: id,
              product: item,
              qty: quantity,
              price: price,
            });
          }

          loadSoldProducts();

          if (by_user == 0) {
            userFilter(users);
          }

          $("#transaction_list").html(transaction_list);
          $("#transactionList").DataTable({
            order: [[1, "desc"]],
            autoWidth: false,
            info: true,
            JQueryUI: true,
            ordering: true,
            paging: true,
            dom: "Bfrtip",
            buttons: ["csv", "excel", "pdf"],
          });
        }
      });
    } else {
      Swal.fire(
        "No data!",
        "No transactions available within the selected criteria",
        "warning"
      );
    }
  });
}

function discend(a, b) {
  if (a.qty > b.qty) {
    return -1;
  }
  if (a.qty < b.qty) {
    return 1;
  }
  return 0;
}

function loadSoldProducts() {
  sold.sort(discend);

  let counter = 0;
  let sold_list = "";
  let items = 0;
  let products = 0;
  $("#product_sales").empty();

  sold.forEach((item, index) => {
    items += item.qty;
    products++;

    let product = allProducts.filter(function (selected) {
      return selected._id == item.id;
    });

    let category = allCategories.filter(function (cat) {
      return product.length > 0 && cat._id == product[0].category;
    });

    let institute = [];
    if (
      typeof allInstitutes !== "undefined" &&
      allInstitutes &&
      allInstitutes.length > 0
    ) {
      institute = allInstitutes.filter(function (inst) {
        return product.length > 0 && inst.id == product[0].institute_id;
      });
    }

    counter++;

    sold_list += `<tr>
            <td>${institute.length > 0 ? institute[0].name : "N/A"}</td>
            <td>${category.length > 0 ? category[0].name : "N/A"}</td>
            <td>${item.product}</td>
            <td>${item.qty}</td>
            <td>${
              product.length > 0 && product[0].stock == 1
                ? product[0].quantity
                : "N/A"
            }</td>
            <td>${
              settings.symbol + (item.qty * parseFloat(item.price)).toFixed(2)
            }</td>
            </tr>`;

    if (counter == sold.length) {
      // Removed: populate totals and product_sales in removed section
    }
  });
}

function userFilter(users) {
  $("#users").empty();
  $("#users").append(`<option value="0">All</option>`);

  users.forEach((user) => {
    let u = allUsers.filter(function (usr) {
      return usr._id == user;
    });

    if (u.length > 0) {
      $("#users").append(`<option value="${user}">${u[0].fullname}</option>`);
    }
  });
}

function loadSoldProductsForModal() {
  sold.sort(discend);

  let counter = 0;
  let sold_list = "";
  let items = 0;
  let products = 0;
  let sales = 0;
  let transact = allTransactions.length;

  sold.forEach((item, index) => {
    items += item.qty;
    products++;
    sales += item.qty * parseFloat(item.price);

    let product = allProducts.filter(function (selected) {
      return selected._id == item.id;
    });

    let category = allCategories.filter(function (cat) {
      return product.length > 0 && cat._id == product[0].category;
    });

    let institute = [];
    if (
      typeof allInstitutes !== "undefined" &&
      allInstitutes &&
      allInstitutes.length > 0
    ) {
      institute = allInstitutes.filter(function (inst) {
        return product.length > 0 && inst.id == product[0].institute_id;
      });
    }

    counter++;

    sold_list += `<tr>
            <td>${category.length > 0 ? category[0].name : "N/A"}</td>
            <td>${item.product}</td>
            <td>${item.qty}</td>
            <td>${
              product.length > 0 && product[0].stock == 1
                ? product[0].quantity
                : "N/A"
            }</td>
            <td>${
              settings.symbol + (item.qty * parseFloat(item.price)).toFixed(2)
            }</td>
            </tr>`;

    if (counter == sold.length) {
      $("#modal_product_sales").html(sold_list);
      $("#modal_counter_sales").text(settings.symbol + sales.toFixed(2));
      $("#modal_counter_transactions").text(transact);
      $("#modal_counter_items").text(items);
      $("#modal_counter_products").text(products);

      // Initialize DataTable for pagination
      $("#modalProductsSold").DataTable({
        paging: true,
        info: false,
        searching: false,
        ordering: true,
        pageLength: 10,
        destroy: true, // Allow re-initialization
      });
    }
  });
}

$("#viewSalesSummary").click(function () {
  loadSoldProductsForModal();
  $("#salesSummaryModal").modal("show");
});

function viewTransaction(index) {
  transaction_index = index;

  let discount = allTransactions[index].discount;
  let customer =
    allTransactions[index].customer == 0 || !allTransactions[index].customer
      ? "Walk in Customer"
      : allTransactions[index].customer.name ||
        allTransactions[index].customer.username ||
        "Walk in Customer";
  let refNumber =
    allTransactions[index].ref_number != ""
      ? allTransactions[index].ref_number
      : allTransactions[index].order;
  let orderNumber = allTransactions[index].order;
  let type = "";
  let tax_row = "";
  let items = "";
  let products = allTransactions[index].items;

  products.forEach((item) => {
    items +=
      "<tr><td>" +
      item.product_name +
      "</td><td>" +
      item.quantity +
      "</td><td>" +
      settings.symbol +
      parseFloat(item.price).toFixed(2) +
      "</td></tr>";
  });

  switch (allTransactions[index].payment_type) {
    case 2:
      type = "Card";
      break;

    default:
      type = "Cash";
  }

  if (allTransactions[index].paid != "") {
    payment = `<tr>
                    <td>Paid</td>
                    <td>:</td>
                    <td>${settings.symbol + allTransactions[index].paid}</td>
                </tr>
                <tr>
                    <td>Change</td>
                    <td>:</td>
                    <td>${
                      settings.symbol +
                      Math.abs(allTransactions[index].change).toFixed(2)
                    }</td>
                </tr>
                <tr>
                    <td>Method</td>
                    <td>:</td>
                    <td>${type}</td>
                </tr>`;
  }

  if (settings.charge_tax) {
    tax_row = `<tr>
                <td>Vat(${settings.percentage})% </td>
                <td>:</td>
                <td>${settings.symbol}${parseFloat(
      allTransactions[index].tax
    ).toFixed(2)}</td>
            </tr>`;
  }

  receipt = `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; background: #fff;">                            
        <!-- Header Section -->
        <div style="padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img style="max-width: 300px; max-height: 120px; width: auto; height: auto;" src="assets/images/logo.jpeg" alt="Logo" onerror="this.style.display='none'" />
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 24px; color: #333; font-weight: 700;">${
                  settings.store
                }</h2>
                ${
                  settings.address_one
                    ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${settings.address_one}</p>`
                    : ""
                }
                ${
                  settings.address_two
                    ? `<p style="margin: 0; font-size: 12px; color: #666;">${settings.address_two}</p>`
                    : ""
                }
                ${
                  settings.contact
                    ? `<p style="margin: 0; font-size: 12px; color: #666;">Tel: ${settings.contact}</p>`
                    : ""
                }
                ${
                  settings.tax
                    ? `<p style="margin: 0; font-size: 12px; color: #666;">Tax ID: ${settings.tax}</p>`
                    : ""
                }
            </div>
            <h1 style="margin: 0; font-size: 42px; color: #000; font-weight: 700; text-align: center;">INVOICE</h1>
        </div>

        <!-- Client and Invoice Details -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div style="flex: 1;">
                <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 14px; color: #000;">Bill to:</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">${customer}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Customer</p>
            </div>
            <div style="text-align: right;">
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Invoice #</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${orderNumber}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Date</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${moment(
                      allTransactions[index].date
                    ).format("MM/DD/YY")}</p>
                </div>
                <div>
                    <p style="margin: 0; font-weight: 700; font-size: 12px; color: #000;">Invoice due date</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${moment(
                      allTransactions[index].date
                    ).format("MM/DD/YY")}</p>
                </div>
            </div>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
                <tr style="border-bottom: 2px solid #000;">
                    <th style="text-align: left; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">ITEMS</th>
                    <th style="text-align: left; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">DESCRIPTION</th>
                    <th style="text-align: center; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">QTY</th>
                    <th style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">PRICE</th>
                    <th style="text-align: center; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">TAX</th>
                    <th style="text-align: right; padding: 12px 8px; font-size: 12px; font-weight: 700; color: #000;">AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                ${products
                  .map(
                    (item) => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px 8px; font-size: 12px; color: #333;">Item</td>
                    <td style="padding: 12px 8px; font-size: 12px; color: #333;">${
                      item.product_name
                    }</td>
                    <td style="text-align: center; padding: 12px 8px; font-size: 12px; color: #333;">${
                      item.quantity
                    }</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; color: #333;">${
                      settings.symbol
                    }${parseFloat(item.price).toFixed(2)}</td>
                    <td style="text-align: center; padding: 12px 8px; font-size: 12px; color: #333;">${
                      settings.charge_tax ? settings.percentage + "%" : "0%"
                    }</td>
                    <td style="text-align: right; padding: 12px 8px; font-size: 12px; color: #333; font-weight: 600;">${
                      settings.symbol
                    }${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>

        <!-- Notes and Total Section -->
        <div style="display: flex; justify-content: space-between; background: linear-gradient(to right, #f9f3e8, #fde8b8); padding: 20px; border-radius: 8px;">
            <div style="flex: 1; padding-right: 20px;">
                <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 14px; color: #000;">Notes:</p>
                <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.6;">${
                  settings.footer || "Thank you for your business!"
                }</p>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">Cashier: ${
                  allTransactions[index].user
                }</p>
                <p style="margin: 0; font-size: 11px; color: #888;">Ref: ${refNumber}</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #000;">TOTAL</p>
                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #000;">${
                  settings.symbol
                }${parseFloat(allTransactions[index].total).toFixed(2)}</p>
                ${
                  discount > 0
                    ? `<p style="margin: 10px 0 0 0; font-size: 11px; color: #666;">Discount: ${
                        settings.symbol
                      }${parseFloat(discount).toFixed(2)}</p>`
                    : ""
                }
                ${
                  settings.charge_tax
                    ? `<p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">Tax (${
                        settings.percentage
                      }%): ${settings.symbol}${parseFloat(
                        allTransactions[index].tax
                      ).toFixed(2)}</p>`
                    : ""
                }
            </div>
        </div>
    </div>`;

  $("#viewTransaction").html("");
  $("#viewTransaction").html(receipt);

  $("#orderModal").modal("show");
}

// Wrapper function for onclick handlers - expose to window for inline onclick
window.viewTransactionModal = function (index) {
  viewTransaction(index);
};

$("#status").change(function () {
  by_status = $(this).find("option:selected").val();
  loadTransactions();
});

$("#tills").change(function () {
  by_till = $(this).find("option:selected").val();
  loadTransactions();
});

$("#users").change(function () {
  by_user = $(this).find("option:selected").val();
  loadTransactions();
});

$("#reportrange").on("apply.daterangepicker", function (ev, picker) {
  start = picker.startDate.format("DD MMM YYYY hh:mm A");
  end = picker.endDate.format("DD MMM YYYY hh:mm A");

  start_date = picker.startDate.toISOString();
  end_date = picker.endDate.toISOString();

  loadTransactions();
});

function authenticate() {
  console.log("=== AUTHENTICATE FUNCTION CALLED ===");

  // Ensure #loading exists and is visible
  if ($("#loading").length === 0) {
    console.log("Creating #loading div");
    $("body").prepend('<div id="loading"></div>');
  }

  // Clear any existing content
  $("#loading").empty();

  // Create the login form HTML
  const loginHTML = `
    <div id="load">
      <div class="login-body">
        <!-- Login Header -->
        <div class="login-header">
          <img src="assets/images/logo.jpeg" alt="Creative Hands Logo" class="login-logo" style="max-height: 90px; max-width: 220px; height: auto; width: auto; object-fit: contain;" onerror="this.style.display='none'">
          <h2>Creative Hands</h2>
          <p>By TEVTA - Point of Sale System</p>
        </div>

        <form id="account" class="login-form">
          <h3>Login to Continue</h3>
          <div class="form-group">
            <div style="position: relative;">
              <input type="text" placeholder="Username" name="username" class="form-control" required autofocus style="padding-left: 45px;">
              <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #999; font-size: 18px; pointer-events: none;">
                <i class="glyphicon glyphicon-user"></i>
              </span>
            </div>
            <div class="error-message" id="username-error"></div>
          </div>
          <div class="form-group">
            <div style="position: relative;">
              <input type="password" placeholder="Password" name="password" class="form-control" required style="padding-left: 45px;">
              <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #999; font-size: 18px; pointer-events: none;">
                <i class="glyphicon glyphicon-lock"></i>
              </span>
            </div>
            <div class="error-message" id="password-error"></div>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-block btn-default" id="login-btn">
              <span class="btn-text">Login</span>
            </button>
          </div>
        </form>
      </div>

      <div class="login-footer">
        <p>Created by <strong>Mr. Zahid Ghaffar</strong> - Chief Instructor IT</p>
        <p>Creative Hands By TEVTA © 2025</p>
      </div>
    </div>
  `;

  // Insert the login form
  $("#loading").html(loginHTML);
  console.log(
    "Login HTML inserted, #loading children:",
    $("#loading").children().length
  );

  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(function () {
    // Ensure it's visible with explicit styles using !important
    const loadingEl = $("#loading")[0];
    if (loadingEl) {
      loadingEl.classList.add("show");
      loadingEl.style.setProperty("display", "flex", "important");
      loadingEl.style.setProperty("align-items", "center", "important");
      loadingEl.style.setProperty("justify-content", "center", "important");
      loadingEl.style.setProperty("flex-direction", "column", "important");
      loadingEl.style.setProperty("height", "100vh", "important");
      loadingEl.style.setProperty("width", "100vw", "important");
      loadingEl.style.setProperty("position", "fixed", "important");
      loadingEl.style.setProperty("top", "0", "important");
      loadingEl.style.setProperty("left", "0", "important");
      loadingEl.style.setProperty("right", "0", "important");
      loadingEl.style.setProperty("bottom", "0", "important");
      loadingEl.style.setProperty("z-index", "99999", "important");
      loadingEl.style.setProperty("overflow", "hidden", "important");

      // Ensure header and footer are visible
      const headerEl = $(".login-header")[0];
      const footerEl = $(".login-footer")[0];
      if (headerEl) {
        headerEl.style.setProperty("display", "block", "important");
        headerEl.style.setProperty("background", "#17411c", "important");
      }
      if (footerEl) {
        footerEl.style.setProperty("display", "block", "important");
        footerEl.style.setProperty("background", "#17411c", "important");
        footerEl.style.setProperty("color", "white", "important");
      }

      console.log(
        "Loading display:",
        window.getComputedStyle(loadingEl).display
      );
      console.log("Loading height:", window.getComputedStyle(loadingEl).height);
      console.log("#load exists:", $("#load").length > 0);
      console.log("Header exists:", $(".login-header").length > 0);
      console.log("Footer exists:", $(".login-footer").length > 0);
    }
  });

  // Focus on username field and add Enter key support
  setTimeout(function () {
    const usernameInput = $("#account input[name='username']");
    const passwordInput = $("#account input[name='password']");

    if (usernameInput.length) {
      usernameInput.focus();
      console.log("Username field focused");

      // Allow Enter key to move to password field
      usernameInput.on("keypress", function (e) {
        if (e.which === 13) {
          e.preventDefault();
          passwordInput.focus();
        }
      });
    } else {
      console.log("Username field not found!");
    }

    // Allow Enter key on password field to submit
    if (passwordInput.length) {
      passwordInput.on("keypress", function (e) {
        if (e.which === 13) {
          e.preventDefault();
          $("#account").submit();
        }
      });
    }
  }, 200);
}

$("body").on("submit", "#account", function (e) {
  e.preventDefault();
  let formData = $(this).serializeObject();
  const $form = $(this);
  const $btn = $("#login-btn");
  const $usernameInput = $form.find('input[name="username"]');
  const $passwordInput = $form.find('input[name="password"]');
  const $usernameError = $("#username-error");
  const $passwordError = $("#password-error");

  // Clear previous errors
  $usernameError.removeClass("show").text("");
  $passwordError.removeClass("show").text("");
  $usernameInput.css("border-color", "#e0e0e0");
  $passwordInput.css("border-color", "#e0e0e0");

  // Validate form
  let hasError = false;
  if (formData.username == "" || formData.username.trim() == "") {
    $usernameError.addClass("show").text("Please enter your username");
    $usernameInput.css("border-color", "#e74c3c");
    hasError = true;
  }
  if (formData.password == "" || formData.password.trim() == "") {
    $passwordError.addClass("show").text("Please enter your password");
    $passwordInput.css("border-color", "#e74c3c");
    hasError = true;
  }

  if (hasError) {
    // Focus on first error field
    if (formData.username == "" || formData.username.trim() == "") {
      $usernameInput.focus();
    } else {
      $passwordInput.focus();
    }
    return;
  }

  // Disable button and show loading state
  $btn.prop("disabled", true).addClass("loading");
  $usernameInput.prop("disabled", true);
  $passwordInput.prop("disabled", true);

  $.ajax({
    url: api + "users/login",
    type: "POST",
    data: JSON.stringify(formData),
    contentType: "application/json; charset=utf-8",
    cache: false,
    processData: false,
    success: function (data) {
      if (data._id) {
        // Success - show success message briefly before reload
        $btn
          .removeClass("loading")
          .html('<span class="btn-text">✓ Success</span>');
        setTimeout(function () {
          storage.set("auth", {
            auth: true,
            role: data.role || "user",
            username: data.username,
          });
          storage.set("user", data);
          // Show main app and footer before reload
          $(".main_app").show();
          $("footer.login-footer").show();
          ipcRenderer.send("app-reload", "");
        }, 500);
      } else {
        // Login failed
        $btn.prop("disabled", false).removeClass("loading");
        $usernameInput.prop("disabled", false);
        $passwordInput.prop("disabled", false);
        $passwordInput.css("border-color", "#e74c3c");
        $passwordError.addClass("show").text(auth_error);
        $passwordInput.focus().select();
        Swal.fire("Oops!", auth_error, "warning");
      }
    },
    error: function (xhr, status, error) {
      // Re-enable form
      $btn.prop("disabled", false).removeClass("loading");
      $usernameInput.prop("disabled", false);
      $passwordInput.prop("disabled", false);

      // Show error message
      let errorMsg = auth_error;
      if (xhr.status === 401 || xhr.status === 403) {
        errorMsg = auth_error;
      } else if (xhr.status === 0) {
        errorMsg = "Unable to connect to server. Please check your connection.";
      } else {
        errorMsg = "An error occurred. Please try again.";
      }

      $passwordInput.css("border-color", "#e74c3c");
      $passwordError.addClass("show").text(errorMsg);
      $passwordInput.focus().select();
      Swal.fire("Error!", errorMsg, "error");
    },
  });
});

$("#quit").click(function () {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to close the application.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Close Application",
  }).then((result) => {
    if (result.value) {
      ipcRenderer.send("app-quit", "");
    }
  });
});
