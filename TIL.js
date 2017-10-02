/*
 * Copyright (c) 2016 Razeware LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//1
window.addEventListener('cloudkitloaded', function() {
  console.log("listening for cloudkitloaded");
  //2
  CloudKit.configure({
    containers: [{
      containerIdentifier: 'iCloud.com.acaso.TIL',
      apiToken: 'c6248556fd4a2737f83500ebd0cc6ddfa79fa7391de016a0b4e5c098c0a127a7',
      environment: 'development'
    }]
  });
  console.log("cloudkitloaded");
  //4                        
  function TILViewModel() {
    var self = this;
    console.log("get default container");
    var container = CloudKit.getDefaultContainer();
    
    console.log("set publicDB");
    var publicDB = container.publicCloudDatabase;
    self.items = ko.observableArray();
    
    // Fetch public records
    self.fetchRecords = function() {
      console.log("obteniendo registros de " + publicDB);
      var query = { recordType: 'Acronym', sortBy: [{ fieldName: 'short'}] };

      // Execute the query.
      return publicDB.performQuery(query).then(function(response) {
        if(response.hasErrors) {
          console.error(response.errors[0]);
          return;
        }
        var records = response.records;
        var numberOfRecords = records.length;
        if (numberOfRecords === 0) {
          console.error('No matching items');
          return;
        }
     
      self.items(records);
      });
    }
    container.setUpAuth().then(function(userInfo) {
      console.log("setUpAuth");
      self.fetchRecords();
    });
  };
  //5
  ko.applyBindings(new TILViewModel());
});
