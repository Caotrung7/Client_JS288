let dsTivi = [];
let dsNhom = [];
let ds = [];

const xuatTivi = (ds = [], Tag) => {
    let html = ``
    ds.forEach((item) => {
        html += `
        <div class="col mb-5">
        <div class="card h-100">
              <!-- Product image-->
              <img class="card-img-top" src="${urlImage}/${item.Ma_so}.png" alt="..." onclick="showModal(this)"/>
              <!-- Product details-->
              <div class="card-body p-4">
                  <div class="text-center">
                      <!-- Product name-->
                      <h5 class="fw-bolder">${item.Ten}</h5>
                      <!-- Product reviews-->
                      <div class="d-flex justify-content-center small text-warning mb-2">
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                      </div>
                      <!-- Product price-->
                      <span class="text-muted">${item.Don_gia_Ban.toLocaleString()}<sup>đ</sup></span>
                  </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <a class="btn btn-sm btn-success mt-auto" href="javaScript:void(0)" onclick="addToCart('${item.Ma_so}',1)" >Add to cart</a>
                    </div>
              </div>
        </div>
    </div>
        `;
    })
    Tag.innerHTML = html;
}

const taoNhom = () => {
    dsNhom = Array.from(new Set(dsTivi
        .map(x => x.Nhom.Ma_so)))
        .map(Ma_so => {
            nhom = {
                Ma_so: Ma_so,
                Ten: dsTivi.find(x => x.Nhom.Ma_so == Ma_so).Nhom.Ten.toUpperCase()
            }
            return nhom
        })
    dsNhom.unshift({
        "Ma_so": "ALL",
        "Ten": "ALL"
    })
}

const xuatNhom = (dsNhom = [], Tag) => {
    let html = ``;
    dsNhom.forEach((nhom, index) => {
        let classActive = (index == 0) ? "btn_active" : "";
        html += `
        <button id="btn${nhom.Ma_so}" class="btn btn-sm btn-success ${classActive}" onclick="xuatSanphamtheoNhom('${nhom.Ma_so}')" >${nhom.Ten}</button>
        `;
    })
    Tag.innerHTML = html;
}

const xuatSanphamtheoNhom = (maNhom) => {
    if (maNhom == "ALL") {
        ds = dsTivi
    } else {
        ds = dsTivi.filter(x => x.Nhom.Ma_so.toLowerCase() == maNhom.toLowerCase())
    }
    document.getElementsByClassName("btn-success btn_active")[0].classList.remove("btn_active");
    document.getElementById(`btn${maNhom}`).classList.add("btn_active");
    updateSlider(ds);
    xuatTivi(ds, thTivi)
}

const sapXepGia = (btn) => {
    let sort = btn.getAttribute("sort");
    if (Number(sort) == 1) {
        //Tăng
        // Sắp Giá tăng
        ds.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        })
        btn.setAttribute("sort", "-1");
        btn.innerHTML = " Giá &Uparrow;";
    } else {
        //Giảm
        // Sắp Giá giảm
        ds.sort((a, b) => {
            return b.Don_gia_Ban - a.Don_gia_Ban
        })
        btn.setAttribute("sort", "1");
        btn.innerHTML = " Giá &Downarrow;";
    }
    xuatTivi(ds, thTivi)
}

const sapXepTen = (btn) => {
    let sort = btn.getAttribute("sort");
    if (Number(sort) == 1) {
        //Sap xep Tang
        ds.sort((a, b) => {
            return a.Ten.toLowerCase().localeCompare(b.Ten.toLowerCase())
        })
        btn.setAttribute("sort", "-1")
        btn.innerHTML = "Tên &Uparrow;";
    } else {
        //Sap xep Giam
        ds.sort((a, b) => {
            return b.Ten.toLowerCase().localeCompare(a.Ten.toLowerCase())
        })
        btn.setAttribute("sort", "1")
        btn.innerHTML = "Tên &Downarrow;";
    }
    xuatTivi(ds, thTivi)
}

/* ----------------LOC GIA THEO RANGE---------------------- */
const rangeInput = document.querySelectorAll(".range-input input");
const priceInput = document.querySelectorAll(".price-input input");
const range = document.querySelector(".slider .progress");
let priceGap = 2000000;

const updateSlider = (ds, options) => {
    //Sort price increase
    ds.sort((a, b) => {
        return a.Don_gia_Ban - b.Don_gia_Ban
    });
    let min = (ds[0].Don_gia_Ban);
    let max = (ds[ds.length - 1].Don_gia_Ban);
    rangeInput.forEach((input => {
        input.setAttribute("min", min)
        input.setAttribute("max", max)
    }))
    //Setup min/max default according to btnNhom
    const { skipUpdateRange, minValChange } = options || {};
    if (!skipUpdateRange) {
        rangeInput[0].value = min;
        rangeInput[1].value = max;
    }

    // Setup priceGap between minVal & maxVal
    let minVal = parseInt(rangeInput[0].value);
    let maxVal = parseInt(rangeInput[1].value);
    if ((maxVal - minVal) < priceGap) {
        if (minValChange) {
            maxVal = maxVal + priceGap;
            if (maxVal > max) {
                maxVal = max;
                minVal = maxVal - priceGap;
            }
            rangeInput[1].value = maxVal;
        } else { //maxChange
            minVal = minVal - priceGap;
            if (minVal < min) {
                minVal = min;
                maxVal = min + priceGap
            }
            minVal = minVal < min ? min : minVal;
            rangeInput[0].value = minVal
        }

    }

    //Format priceInput to VN-currency
    const numberFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });
    priceInput[0].value = numberFormatter.format(minVal)
        .replace("VND", "")
        .trim();
    priceInput[1].value = numberFormatter.format(maxVal)
        .replace("VND", "")
        .trim()

    // Format slider progress    
    const rangeLength = max - min;
    const leftRange = minVal - min
    const rightRange = max - maxVal
    range.style.left = (leftRange / rangeLength) * 100 + "%";
    range.style.right = (rightRange / rangeLength) * 100 + "%";
}

priceInput.forEach(input => {
    input.addEventListener("input", e => {
        ds.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        });
        let min = (ds[0].Don_gia_Ban);
        let max = (ds[ds.length - 1].Don_gia_Ban);
        input.setAttribute("min", min)
        input.setAttribute("max", max)

        if ((max - min >= priceGap) && max <= rangeInput[1].max) {
            if (e.target.className === "input-min") {
                rangeInput[0].value = min;
                range.style.left = ((min / rangeInput[0].max) * 100) + "%";
            } else {
                rangeInput[1].value = max;
                range.style.right = 100 - (max / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        ds.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        });
        let minVal = parseInt(rangeInput[0].value);
        let maxVal = parseInt(rangeInput[1].value);

        updateSlider(ds, { skipUpdateRange: true, minValChange: e.target.id === "thGiaMin" });

        let dsFilter = ds.filter(x => x.Don_gia_Ban <= maxVal && x.Don_gia_Ban >= minVal);

        xuatTivi(dsFilter, thTivi);
    });

});
/* ----------------------------------------------------------------------------------------- */


/* ----------------LỌC SẢN PHẨM THEO GIÁ TRỊ TÌM---------------------- */
const keyCode = (event) => {
    if (event.keyCode == 13) {
        let gtTim = event.target.value;
        let dsTim = ds.filter(x => x.Ten.toLowerCase().includes(gtTim.toLowerCase()));
        xuatTivi(dsTim, thTivi)
    }
}