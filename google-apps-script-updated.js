// Updated Google Apps Script for TECH MASTER CRM
// Replace your existing doPost function with this enhanced version

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName("Sheet1");
  var logSheet = ss.getSheetByName("Log");
  var data = JSON.parse(e.postData.contents);

  // Enable CORS for all responses
  var response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // 1. Create Customer (Enhanced)
    if (data.action === "create") {
      var lastRow = masterSheet.getLastRow();
      var newId = "CUST-" + (lastRow > 0 ? lastRow : 1);
      var date = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss");
      
      var row = [
        date,                    // A: Date
        newId,                   // B: Customer ID
        data.name,               // C: Name
        data.address,            // D: Address
        data.phone,              // E: Phone
        data.email || "",        // F: Email
        data.gutter || "None",   // G: Gutter Services
        data.ceiling || "None",  // H: Ceiling Services
        data.roof || "None",     // I: Roof Services
        data.status || "Not Confirmed", // J: Status
        data.notes || "",        // K: Notes
        0,                       // L: Paid Amount
        parseFloat(data.totalValue) || 0, // M: Total Value
        "NEW"                    // N: Record Status
      ];
      
      masterSheet.appendRow(row);
      
      // Log the activity
      if (logSheet) {
        logSheet.appendRow([
          date,
          "CREATE",
          newId,
          "Customer created: " + data.name,
          Session.getActiveUser().getEmail()
        ]);
      }
      
      return response.setContent(JSON.stringify({
        result: "success", 
        id: newId,
        message: "Customer created successfully"
      }));
    }

    // 2. Update Payment (Enhanced)
    if (data.action === "update") {
      var lastRow = masterSheet.getLastRow();
      var ids = masterSheet.getRange(2, 2, lastRow - 1, 1).getValues();
      var rowIndex = -1;
      
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] == data.customerId) { 
          rowIndex = i + 2; 
          break; 
        }
      }
      
      if (rowIndex !== -1) {
        var currentPaid = parseFloat(masterSheet.getRange(rowIndex, 12).getValue() || 0);
        var totalValue = parseFloat(masterSheet.getRange(rowIndex, 13).getValue() || 0);
        var paymentToAdd = parseFloat(data.payment);
        var newPaidTotal = currentPaid + paymentToAdd;
        
        // Update paid amount
        masterSheet.getRange(rowIndex, 12).setValue(newPaidTotal);
        
        // Auto-update status based on payment
        var newStatus = masterSheet.getRange(rowIndex, 10).getValue();
        if (newPaidTotal >= totalValue) {
          newStatus = "Completed";
        } else if (newPaidTotal > 0 && newStatus === "Not Confirmed") {
          newStatus = "Pending";
        }
        masterSheet.getRange(rowIndex, 10).setValue(newStatus);
        
        // Log the payment
        if (logSheet) {
          logSheet.appendRow([
            Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss"),
            "PAYMENT",
            data.customerId,
            "Payment added: LKR " + paymentToAdd + " via " + (data.method || "Cash"),
            Session.getActiveUser().getEmail()
          ]);
        }
        
        return response.setContent(JSON.stringify({
          result: "success",
          message: "Payment added successfully",
          newPaidAmount: newPaidTotal,
          newStatus: newStatus
        }));
      }
      
      return response.setContent(JSON.stringify({
        result: "error", 
        message: "Customer ID not found"
      }));
    }

    // 3. Get All Customers (Enhanced)
    if (data.action === "getAll") {
      var rows = masterSheet.getDataRange().getValues();
      var customers = [];
      
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][14] !== "DELETED") { // Skip deleted records
          var services = [];
          if (rows[i][6] && rows[i][6] !== "None") services.push(rows[i][6]);
          if (rows[i][7] && rows[i][7] !== "None") services.push(rows[i][7]);
          if (rows[i][8] && rows[i][8] !== "None") services.push(rows[i][8]);
          
          customers.push({
            id: rows[i][1], // Use Customer ID as id
            customerId: rows[i][1],
            name: rows[i][2],
            address: rows[i][3],
            phone: rows[i][4],
            email: rows[i][5] || null,
            gutter: rows[i][6] || "None",
            ceiling: rows[i][7] || "None",
            roof: rows[i][8] || "None",
            status: rows[i][9] || "Not Confirmed",
            notes: rows[i][10] || null,
            paidAmount: parseFloat(rows[i][11]) || 0,
            totalValue: parseFloat(rows[i][12]) || 0,
            services: services.join(", "),
            createdAt: rows[i][0],
            updatedAt: rows[i][0]
          });
        }
      }
      
      return response.setContent(JSON.stringify(customers));
    }

    // 4. Get Dashboard Stats
    if (data.action === "getStats") {
      var rows = masterSheet.getDataRange().getValues();
      var stats = { 
        "Not Confirmed": 0, 
        "Quotation Issued": 0, 
        "Approved": 0,
        "Pending": 0,
        "In Progress": 0,
        "Completed": 0, 
        "Rejected": 0 
      };
      
      var totalRevenue = 0;
      var totalPaid = 0;
      var recentCustomers = [];
      
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][14] !== "DELETED") {
          var status = rows[i][9] || "Not Confirmed";
          if (stats.hasOwnProperty(status)) {
            stats[status]++;
          }
          
          var totalValue = parseFloat(rows[i][12]) || 0;
          var paidAmount = parseFloat(rows[i][11]) || 0;
          
          totalRevenue += totalValue;
          totalPaid += paidAmount;
          
          // Collect recent customers (last 5)
          if (recentCustomers.length < 5) {
            recentCustomers.push({
              id: rows[i][1],
              customerId: rows[i][1],
              name: rows[i][2],
              status: status,
              totalValue: totalValue,
              paidAmount: paidAmount,
              createdAt: rows[i][0]
            });
          }
        }
      }
      
      var outstanding = totalRevenue - totalPaid;
      
      return response.setContent(JSON.stringify({
        overview: {
          totalCustomers: rows.length - 1, // Exclude header
          totalRevenue: totalRevenue,
          totalPaid: totalPaid,
          outstanding: outstanding,
          averageProjectValue: rows.length > 1 ? totalRevenue / (rows.length - 1) : 0
        },
        statusStats: stats,
        recentCustomers: recentCustomers.reverse(), // Most recent first
        recentPayments: [] // You can enhance this with payment tracking
      }));
    }

    // 5. Edit Customer
    if (data.action === "edit") {
      var lastRow = masterSheet.getLastRow();
      var ids = masterSheet.getRange(2, 2, lastRow - 1, 1).getValues();
      var rowIndex = -1;
      
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] == data.customerId) { 
          rowIndex = i + 2; 
          break; 
        }
      }
      
      if (rowIndex !== -1) {
        masterSheet.getRange(rowIndex, 3).setValue(data.name);
        masterSheet.getRange(rowIndex, 4).setValue(data.address);
        masterSheet.getRange(rowIndex, 5).setValue(data.phone);
        masterSheet.getRange(rowIndex, 6).setValue(data.email || "");
        masterSheet.getRange(rowIndex, 7).setValue(data.gutter || "None");
        masterSheet.getRange(rowIndex, 8).setValue(data.ceiling || "None");
        masterSheet.getRange(rowIndex, 9).setValue(data.roof || "None");
        masterSheet.getRange(rowIndex, 10).setValue(data.status);
        masterSheet.getRange(rowIndex, 11).setValue(data.notes || "");
        masterSheet.getRange(rowIndex, 13).setValue(parseFloat(data.totalValue) || 0);
        
        // Log the edit
        if (logSheet) {
          logSheet.appendRow([
            Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss"),
            "EDIT",
            data.customerId,
            "Customer updated: " + data.name,
            Session.getActiveUser().getEmail()
          ]);
        }
        
        return response.setContent(JSON.stringify({
          result: "success",
          message: "Customer updated successfully"
        }));
      }
      
      return response.setContent(JSON.stringify({
        result: "error", 
        message: "Customer ID not found"
      }));
    }

    // 6. Delete Customer (Soft Delete)
    if (data.action === "delete") {
      var lastRow = masterSheet.getLastRow();
      var ids = masterSheet.getRange(2, 2, lastRow - 1, 1).getValues();
      var rowIndex = -1;
      
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] == data.customerId) { 
          rowIndex = i + 2; 
          break; 
        }
      }
      
      if (rowIndex !== -1) {
        masterSheet.getRange(rowIndex, 14).setValue("DELETED"); // Soft delete
        
        // Log the deletion
        if (logSheet) {
          logSheet.appendRow([
            Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss"),
            "DELETE",
            data.customerId,
            "Customer deleted",
            Session.getActiveUser().getEmail()
          ]);
        }
        
        return response.setContent(JSON.stringify({
          result: "success",
          message: "Customer deleted successfully"
        }));
      }
      
      return response.setContent(JSON.stringify({
        result: "error", 
        message: "Customer ID not found"
      }));
    }

    // Default response for unknown actions
    return response.setContent(JSON.stringify({
      result: "error", 
      message: "Unknown action: " + data.action
    }));

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return response.setContent(JSON.stringify({
      result: "error", 
      message: "Server error: " + error.toString()
    }));
  }
}

// Helper function to enable CORS
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "CRM API is running",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}