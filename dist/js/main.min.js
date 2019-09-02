'use strict';

class Select {
  constructor() {
    this.data = {};

    this.mnemo = [
      '20000',
      '10000',
      '10001',
      '40001',
      '40002',
      '90000',
      '90001',
    ];

    this.opts = {
      url: 'php/getData.php',
      table: 'kp',
      param: '',
    };
  }
  

  ajax(opts, callback) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', opts.url + '?table=' + opts.table + '&param=' + opts.param);
      xhr.send(null);
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
              callback(xhr.responseText);
          }
      };
  }

  setMnemoText(data){
      let new_data = JSON.parse(JSON.stringify(data));
      let length = new_data.length;
      for(let i=0;i<length; i++){
          if(mnemo.includes(new_data[i].mnemo_id)) {
              new_data[i].place = 'Участок';
          } else {
              new_data[i].place = 'Станция';
          }
      }
      console.log(new_data);
      return new_data;
  }

  handlerCheck(){
      let check = document.querySelectorAll('input[name=extend]')[0];
      let info = document.getElementsByClassName('info');
      check.addEventListener('change', function() {
          if(this.checked) {
              for (let item of info) {
                  item.style.display = 'block';
              }
          } else {
              for (let item of info) {
                  item.style.display = 'none';
              }
          }
      });
  }

  checked() {
      let el = document.querySelector('input[name=extend]');
      if (el.checked) {
          return 'block';
      } else {
          return 'none';
      }
  }

  showData(xhr) {
      let data = JSON.parse(this.responseText);
      if(data.hasOwnProperty('error')) {
          alert(data.error);
      }
      data = setMnemoText(data);
      let result = document.querySelectorAll('#result')[0];
      result.innerHTML = '';
      data.forEach(function (item) {
          let div = document.createElement('div');
          let sign = item.dev_desc == '1'?'Нет':'Да';
          div.innerHTML = item.sign + ' - ' + sign;
          div.innerHTML += `<span class="info" style="display: ${checked()};">&angrt; id: ${item.val_id}, ip: ${item.interface}, id_shem: ${item.id_shem}, id_mnemo: ${item.mnemo_id}, signal: ${item.dev_desc}, ${item.place}</span>`;
          if(item.dev_desc == '0') {
              div.className ='alarm';
          }
          if(item.title !== null) {
              div.setAttribute('title', item.title);
          }
          result.appendChild(div);
      });
      handlerCheck();
  }

  getData() {
    this.getDataFromDB().then(
      result => {
        let data = JSON.parse(result);
        this.data.stations = data;
        console.log(data);
        return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', this.opts.url + '?table=' + 'ts' + '&param=' + data[0].id);
        
          xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.responseText);
            } else {
              let error = new Error(this.statusText);
              error.code = this.status;
              reject(error);
            }
        };
        xhr.onerror = function() {
          reject(new Error("Network Error"));
        };
        xhr.send(null);
        });
      }, 
      error => console.log(error)
    ).then(

        result => {
          this.data.ts = JSON.parse(result);
          console.log(this.data);
        },
        null
    );
  }

  getDataFromDB(){
      return new Promise((resolve, reject) => {
        
        let xhr = new XMLHttpRequest();
        xhr.open('GET', this.opts.url + '?table=' + this.opts.table + '&param=' + this.opts.param);
        
        xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.responseText);
            } else {
              let error = new Error(this.statusText);
              error.code = this.status;
              reject(error);
            }
        };
        xhr.onerror = function() {
          reject(new Error("Network Error"));
        };
        xhr.send(null);
      });
  }

}



let data = new Select();

data.getData();

