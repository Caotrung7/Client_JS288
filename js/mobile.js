let dsDienthoai = [];
let dsNhom2 = [];
let ds2 = [];

const xuatMobile = (ds2 = [], Tag) => {
    let html = ``
    ds2.sort((a, b) => {
        return a.Don_gia_Ban - b.Don_gia_Ban;
    })
    ds2.forEach((item) => {
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
                    <a class="btn btn-sm btn-success mt-auto" href="javaScript:void(0)" onclick="addToCart('${item.Ma_so}',2)" >Add to cart</a>
                </div>
              </div>
        </div>
    </div>
        `;
    })
    Tag.innerHTML = html;
}

const taoNhom2 = () => {
    dsNhom2 = Array.from(new Set(dsDienthoai
        .map(x => x.Nhom.Ma_so)))
        .map(Ma_so => {
            nhom = {
                Ma_so: Ma_so,
                Ten: dsDienthoai.find(x => x.Nhom.Ma_so == Ma_so).Nhom.Ten.toUpperCase()
            }
            return nhom
        })
    dsNhom2.unshift({
        "Ma_so": "ALL",
        "Ten": "ALL"
    })
}

const xuatNhom2 = (dsNhom2 = [], Tag) => {
    let html = ``;
    dsNhom2.forEach((nhom, index) => {
        let classActive = (index == 0) ? "btn_active" : "";
        html += `
        <button id="btn${nhom.Ma_so}" class="btn btn-sm btn-success ${classActive}" onclick="xuatSanphamtheoNhom2('${nhom.Ma_so}')" >${nhom.Ten}</button>
        `;
    })
    Tag.innerHTML = html;
}

const xuatSanphamtheoNhom2 = (maNhom) => {
    if (maNhom == "ALL") {
        ds2 = dsDienthoai
    } else {
        ds2 = dsDienthoai.filter(x => x.Nhom.Ma_so.toLowerCase() == maNhom.toLowerCase())
    }
    document.getElementsByClassName("btn-success btn_active")[0].classList.remove("btn_active");
    document.getElementById(`btn${maNhom}`).classList.add("btn_active");
    updateSlider2(ds2);
    xuatMobile(ds2, thMobile)
}

const sapXepGia2 = (btn) => {
    let sort = btn.getAttribute("sort");
    if (Number(sort) == 1) {
        //Tăng
        // Sắp Giá tăng
        ds2.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        })
        btn.setAttribute("sort", "-1");
        btn.innerHTML = " Giá &Uparrow;";
    } else {
        //Giảm
        // Sắp Giá giảm
        ds2.sort((a, b) => {
            return b.Don_gia_Ban - a.Don_gia_Ban
        })
        btn.setAttribute("sort", "1");
        btn.innerHTML = " Giá &Downarrow;";
    }
    xuatMobile(ds2, thMobile)
}

const sapXepTen2 = (btn) => {
    let sort = btn.getAttribute("sort");
    if (Number(sort) == 1) {
        //Sap xep Tang
        ds2.sort((a, b) => {
            return a.Ten.toLowerCase().localeCompare(b.Ten.toLowerCase())
        })
        btn.setAttribute("sort", "-1")
        btn.innerHTML = "Tên &Uparrow;";
    } else {
        //Sap xep Giam
        ds2.sort((a, b) => {
            return b.Ten.toLowerCase().localeCompare(a.Ten.toLowerCase())
        })
        btn.setAttribute("sort", "1")
        btn.innerHTML = "Tên &Downarrow;";
    }
    xuatMobile(ds2, thMobile)
}

/* ----------------LOC GIA THEO RANGE---------------------- */
const rangeInput2 = document.querySelectorAll(".range-input input");
const priceInput2 = document.querySelectorAll(".price-input input");
const range2 = document.querySelector(".slider .progress");
let priceGap2 = 2000000;

const updateSlider2 = (ds2, options) => {
    //Sort price increase
    ds2.sort((a, b) => {
        return a.Don_gia_Ban - b.Don_gia_Ban
    });
    let min = (ds2[0].Don_gia_Ban);
    let max = (ds2[ds2.length - 1].Don_gia_Ban);
    rangeInput2.forEach((input => {
        input.setAttribute("min", min)
        input.setAttribute("max", max)
    }))
    //Setup min/max default according to btnNhom
    const { skipUpdateRange, minValChange } = options || {};
    if (!skipUpdateRange) {
        rangeInput2[0].value = min;
        rangeInput2[1].value = max;
    }

    // Setup priceGap between minVal & maxVal
    let minVal = parseInt(rangeInput2[0].value);
    let maxVal = parseInt(rangeInput2[1].value);
    if ((maxVal - minVal) < priceGap2) {
        if (minValChange) {
            maxVal = maxVal + priceGap2;
            if (maxVal > max) {
                maxVal = max;
                minVal = maxVal - priceGap2;
            }
            rangeInput2[1].value = maxVal;
        } else { //maxChange
            minVal = minVal - priceGap2;
            if (minVal < min) {
                minVal = min;
                maxVal = min + priceGap2
            }
            minVal = minVal < min ? min : minVal;
            rangeInput2[0].value = minVal
        }

    }

    //Format priceInput to VN-currency
    const numberFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });
    priceInput2[0].value = numberFormatter.format(minVal)
        .replace("VND", "")
        .trim();
    priceInput2[1].value = numberFormatter.format(maxVal)
        .replace("VND", "")
        .trim()

    // Format slider progress    
    const rangeLength = max - min;
    const leftRange = minVal - min
    const rightRange = max - maxVal
    range2.style.left = (leftRange / rangeLength) * 100 + "%";
    range2.style.right = (rightRange / rangeLength) * 100 + "%";
}

priceInput2.forEach(input => {
    input.addEventListener("input", e => {
        ds2.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        });
        let min = (ds2[0].Don_gia_Ban);
        let max = (ds2[ds2.length - 1].Don_gia_Ban);
        input.setAttribute("min", min)
        input.setAttribute("max", max)

        if ((max - min >= priceGap2) && max <= rangeInput2[1].max) {
            if (e.target.className === "input-min") {
                rangeInput2[0].value = min;
                range2.style.left = ((min / rangeInput2[0].max) * 100) + "%";
            } else {
                rangeInput2[1].value = max;
                range2.style.right = 100 - (max / rangeInput2[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput2.forEach(input => {
    input.addEventListener("input", e => {
        ds2.sort((a, b) => {
            return a.Don_gia_Ban - b.Don_gia_Ban
        });
        let minVal = parseInt(rangeInput2[0].value);
        let maxVal = parseInt(rangeInput2[1].value);

        updateSlider2(ds2, { skipUpdateRange: true, minValChange: e.target.id === "thGiaMin" });

        let dsFilter = ds2.filter(x => x.Don_gia_Ban <= maxVal && x.Don_gia_Ban >= minVal);

        xuatMobile(dsFilter, thMobile);
    });

});
/* ----------------------------------------------------------------------------------------- */

/* ----------------LỌC SẢN PHẨM THEO GIÁ TRỊ TÌM---------------------- */
const keyCode2 = (event) => {
    if (event.keyCode == 13) {
        let gtTim = event.target.value;
        let dsTim = ds2.filter(x => x.Ten.toLowerCase().includes(gtTim.toLowerCase()));
        xuatMobile(dsTim, thMobile);
    }
}