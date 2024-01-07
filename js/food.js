let dsFood = [];
let dsNhom3 = [];
let ds3 = [];

const xuatFood = (ds3 = [], Tag) => {
    let html = ``
    ds3.forEach((item) => {
        html += `
        <div class="col mb-5">
        <div class="card h-100">
              <!-- Sale badge-->
              <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
              <!-- Product image-->
              <img class="card-img-top" src="${urlImage}/${item.Ma_so}.png" alt="..." />
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
                    <a class="btn btn-sm btn-success mt-auto" href="javaScript:void(0)" onclick="addToCart('${item.Ma_so}',3)" >Add to cart</a>
                </div>
              </div>
        </div>
    </div>
        `;
    })
    Tag.innerHTML = html;
}

const taoNhom3 = () => {
    dsNhom3 = Array.from(new Set(dsFood
        .map(x => x.Nhom.Ma_so)))
        .map(Ma_so => {
            nhom = {
                Ma_so: Ma_so,
                Ten: dsFood.find(x => x.Nhom.Ma_so == Ma_so).Nhom.Ten.toUpperCase()
            }
            return nhom
        })
    dsNhom3.unshift({
        "Ma_so": "ALL",
        "Ten": "ALL"
    })
}

const xuatNhom3 = (dsNhom3 = [], Tag) => {
    let html = ``;
    dsNhom3.forEach((nhom, index) => {
        let classActive = (index == 0) ? "btn_active" : "";
        html += `
        <button id="btn${nhom.Ma_so}" class="btn btn-sm btn-success ${classActive}" onclick="xuatSanphamtheoNhom3 = (maNhom) => {
            ('${nhom.Ma_so}')" >${nhom.Ten}</button>
        `;
    })
    Tag.innerHTML = html;
}

const xuatSanphamtheoNhom3 = (maNhom) => {
    if (maNhom == "ALL") {
        ds3 = dsFood
    } else {
        ds3 = dsFood.filter(x => x.Nhom.Ma_so.toLowerCase() == maNhom.toLowerCase())
    }
    document.getElementsByClassName("btn-success btn_active")[0].classList.remove("btn_active");
    document.getElementById(`btn${maNhom}`).classList.add("btn_active");
    updateSlider3(ds3);
    xuatFood(ds3, thFood);
}

const sapXepGia3 = (btn) => {
    let sort = btn.getAttribute("sort");
    if (Number(sort) == 1) {
        //Tăng
        // Sắp Giá tăng
        ds3.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        })
        btn.setAttribute("sort", "-1");
        btn.innerHTML = " Giá &Uparrow;";
    } else {
        //Giảm
        // Sắp Giá giảm
        ds3.sort((a, b) => {
            return b.Don_gia_Ban - a.Don_gia_Ban
        })
        btn.setAttribute("sort", "1");
        btn.innerHTML = " Giá &Downarrow;";
    }
    xuatFood(ds3, thFood);
}

const sapXepTen3 = (btn) => {
    let sort = btn.getAttribute("sort");
    if (Number(sort) == 1) {
        //Sap xep Tang
        ds3.sort((a, b) => {
            return a.Ten.toLowerCase().localeCompare(b.Ten.toLowerCase())
        })
        btn.setAttribute("sort", "-1")
        btn.innerHTML = "Tên &Uparrow;";
    } else {
        //Sap xep Giam
        ds3.sort((a, b) => {
            return b.Ten.toLowerCase().localeCompare(a.Ten.toLowerCase())
        })
        btn.setAttribute("sort", "1")
        btn.innerHTML = "Tên &Downarrow;";
    }
    xuatFood(ds3, thFood);
}

/* ----------------LOC GIA THEO RANGE---------------------- */
const rangeInput3 = document.querySelectorAll(".range-input input");
const priceInput3 = document.querySelectorAll(".price-input input");
const range3 = document.querySelector(".slider .progress");
let priceGap3 = 3000;

const updateSlider3 = (ds3, options) => {
    //Sort price increase
    ds3.sort((a, b) => {
        return a.Don_gia_Ban - b.Don_gia_Ban
    });
    let min = (ds3[0].Don_gia_Ban);
    let max = (ds3[ds3.length - 1].Don_gia_Ban);
    rangeInput3.forEach((input => {
        input.setAttribute("min", min)
        input.setAttribute("max", max)
    }))
    //Setup min/max default according to btnNhom
    const { skipUpdateRange, minValChange } = options || {};
    if (!skipUpdateRange) {
        rangeInput3[0].value = min;
        rangeInput3[1].value = max;
    }

    // Setup priceGap between minVal & maxVal
    let minVal = parseInt(rangeInput3[0].value);
    let maxVal = parseInt(rangeInput3[1].value);
    if ((maxVal - minVal) < priceGap3) {
        if (minValChange) {
            maxVal = maxVal + priceGap3;
            if (maxVal > max) {
                maxVal = max;
                minVal = maxVal - priceGap3;
            }
            rangeInput3[1].value = maxVal;
        } else { //maxChange
            minVal = minVal - priceGap3;
            if (minVal < min) {
                minVal = min;
                maxVal = min + priceGap3
            }
            minVal = minVal < min ? min : minVal;
            rangeInput3[0].value = minVal;
        }

    }

    //Format priceInput to VN-currency
    const numberFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });
    priceInput3[0].value = numberFormatter.format(minVal)
        .replace("VND", "")
        .trim();
        priceInput3[1].value = numberFormatter.format(maxVal)
        .replace("VND", "")
        .trim()

    // Format slider progress    
    const rangeLength = max - min;
    const leftRange = minVal - min
    const rightRange = max - maxVal
    range3.style.left = (leftRange / rangeLength) * 100 + "%";
    range3.style.right = (rightRange / rangeLength) * 100 + "%";
}

priceInput3.forEach(input => {
    input.addEventListener("input", e => {
        ds3.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        });
        let min = (ds3[0].Don_gia_Ban);
        let max = (ds3[ds3.length - 1].Don_gia_Ban);
        input.setAttribute("min", min)
        input.setAttribute("max", max)

        if ((max - min >= priceGap3) && max <= rangeInput3[1].max) {
            if (e.target.className === "input-min") {
                rangeInput3[0].value = min;
                range3.style.left = ((min / rangeInput3[0].max) * 100) + "%";
            } else {
                rangeInput3[1].value = max;
                range3.style.right = 100 - (max / rangeInput3[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput3.forEach(input => {
    input.addEventListener("input", e => {
        ds3.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        });
        let minVal = parseInt(rangeInput3[0].value);
        let maxVal = parseInt(rangeInput3[1].value);

        updateSlider3(ds3, { skipUpdateRange: true, minValChange: e.target.id === "thGiaMin" });

        let dsFilter = ds3.filter(x => x.Don_gia_Ban <= maxVal && x.Don_gia_Ban >= minVal);

        xuatFood(dsFilter, thFood);
    });

});
/* ----------------------------------------------------------------------------------------- */

/* ----------------LỌC SẢN PHẨM THEO GIÁ TRỊ TÌM---------------------- */
const keyCode3 = (event) => {
    if (event.keyCode == 13) {
        let gtTim = event.target.value;
        let dsTim = ds3.filter(x => x.Ten.toLowerCase().includes(gtTim.toLowerCase()));
        xuatFood(dsTim, thFood);
    }
}






