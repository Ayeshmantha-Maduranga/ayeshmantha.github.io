const swup = new Swup();

var json = null;
jQuery.ajax({
    'async': false,
    'global': false,
    'url': "data.json",
    'dataType': "json",
    'success': function (data) {
        json = data;
    }
});

const options = {
    animateHistoryBrowsing: true,
    skipPopStateHandling: true
};

init();
swup.on('contentReplaced', init);
window.addEventListener("popstate", detectHistroy);

function detectHistroy() {
    location.reload();
}



//<------- load another page -------------->

var url = new URL(document.URL);
var loadurl = url.searchParams.get("web");
console.log(loadurl);

// Run once when page loads
if (document.readyState === 'complete') {
    if (loadurl != null) {
        afterload();
    }
} else {
    if (loadurl != null) {
        document.addEventListener('DOMContentLoaded', () => afterload());
    }
}

function afterload() {
    swup.loadPage({ url: '/' + loadurl })
}


jQuery(document).ready(function ($) {
    // --------- Infor Bar ---------------
    let InforItem = json["info_bar"];
    $(".deicript").text(InforItem["deicript"]);
    $(".inforname").text(InforItem["name"]);
    $(".infor_lamp_light").prop('title', InforItem["infor_lamp_light"]);

    // <---- load bar name
    $(".load_name").text(InforItem["load_name"]);

    // <----- about_bar
    let txt = "";
    for (let index = 0; index < InforItem["about_bar"].length; index++) {
        const element = InforItem["about_bar"][index];
        txt += `
        <li>
            <h6>${element[0]}</h6><span>${element[1]}</span>
        </li>
    `;
    }
    $(".about_bar").html(txt);

    //<----- skill1_bar
    $(".skills1_Title").text(InforItem["skill1Name"]);
    txt = "";
    for (let index = 0; index < InforItem["skill1List"].length; index++) {
        const element = InforItem["skill1List"][index];
        txt += `
        <div class="art-lang-skills-item">
            <div id="circleprog1-${index + 1}" data-type="circles" data-value="${element[1]}"
                class="art-cirkle-progress art-skills-progress"></div>
            <h6>${element[0]}</h6>
        </div>
        `;
    }
    $(".skill1List").html(txt);

    //<----- skill2_bar
    $(".skills2_Title").text(InforItem["skill2Name"]);
    txt = "";
    for (let index = 0; index < InforItem["skill2List"].length; index++) {
        const element = InforItem["skill2List"][index];
        txt += `
        <div class="art-hard-skills-item">
            <div class="art-skill-heading">
                <h6>${element[0]}</h6>
            </div>
            <div class="art-line-progress">
                <div id="lineprog2-${index}" data-type="progress" data-value="${element[1]}"
                    class="art-skills-progress"></div>
            </div>
        </div>
        `;
    }
    $(".skill2List").html(txt);
    //<----- skill3_bar
    $(".skills3_Title").text(InforItem["skill3Name"]);
    txt = "";
    for (let index = 0; index < InforItem["skill3List"].length; index++) {
        const element = InforItem["skill3List"][index];
        txt += `
        <li><i class="fas fa-check"></i>${element}</li>
        `;
    }
    $(".skill3List").html(txt);
    //<---- CV download link
    $(".CV_link").prop('href', InforItem["CV_link"]);

    //------------------------- build right Menu ------------------------------
    txt = "";
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/'));
    let menuItem = json["menu"];
    // console.log(filename);
    for (let index = 0; index < menuItem.length; index++) {
        const element = menuItem[index];
        if (element["subName"] == null) {
            if (filename == element["link"]) {
                txt += `
                <li id="menu-item-20${index}" class=" menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item">
                    <a href=${element["link"]}>${element["name"]}</a>
                </li>
                `;
                $(".art-current-page").html(`<a href=${element["link"]}">${element["name"]}</a>`);
            }
            else {
                txt += `
                <li id="menu-item-20${index}" class=" menu-item menu-item-type-post_type menu-item-object-page menu-item-home">
                    <a href=${element["link"]}>${element["name"]}</a>
                </li>
                `;
            }
        }
        else {
            txt += `
            <li id="menu-item-20${index}" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children">
                <a>${element["name"]}</a>
                <ul class="sub-menu">
            `;
            for (let subindex = 0; subindex < element["subName"].length; subindex++) {
                const subelement = element["subName"][subindex];
                if (filename == subelement["link"]) {
                    txt += `
                    <li id="menu-item-2${index}${subindex}" class=" menu-item menu-item-type-post_type menu-item-object-page current-menu-item">
                        <a href=${subelement["link"]}>${subelement["name"]}</a>
                    </li>
                    `;
                    // $(".art-current-page").html(`<a href=${element["link"]}">${element["name"]}</a>`);
                }
                else {
                    txt += `
                    <li id="menu-item-2${index}${subindex}" class=" menu-item menu-item-type-post_type menu-item-object-page">
                        <a href=${subelement["link"]}>${subelement["name"]}</a>
                    </li>
                    `;
                }
            }
            txt += `</ul></li>`;
        }
    }
    $(".main-menu").html(txt);

    // ----img dragble off 
    $("img").attr('draggable', 'false');

    $('.menu-item-has-children a').on('click', function () {
        $('.menu-item-has-children').toggleClass("opened");
        $('.sub-menu').toggleClass('art-active');
    });

});

// <------------- File body data inserd ---------------
function init() {
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/'));
    console.log(filename);
    //<---remove menu hilgh one
    let menuItem = json["menu"];
    var elemsArry = Array.from(document.querySelectorAll(".menu-item"));
    if (elemsArry.length > 0) {
        elemsArry.forEach((element, index) => {
            element.classList.remove("current-menu-item");
        });
        document.querySelector('.menu-item-has-children a').addEventListener('click', function () {
            document.querySelector('.menu-item-has-children').classList.toggle("opened");
            document.querySelector('.sub-menu').classList.toggle('art-active');
        });
    }

    // ------------------ comman data load --------------------
    let footer_data = json["footer"];
    document.querySelector('.footer').innerHTML = `
        <div>${footer_data['copyright']}</div>
        <div>Email: <a href="mailto:${footer_data['mail']}" target="_blank">${footer_data['mail']}</a></div>
    `;
    // ------------------ page json data load -----------------
    if (filename == menuItem[0]['link'] || filename == '/') {
        //------------------------- Home menu ------------------------------
        // <---- menu name highlight
        const MenuList = document.querySelectorAll('.menu-item');
        if (MenuList.length > 0) {
            MenuList[0].classList.add('current-menu-item');
            document.querySelector(".art-current-page").innerHTML = `<a href=${menuItem[0]['link']}">${menuItem[0]['name']}</a>`;
        }
        // <---- Banner
        let home_data = json["home"];
        document.getElementById("Banner_title").innerHTML = home_data["title"];
        document.getElementById("title_tag1").innerHTML = home_data["tag"];
        document.getElementById("title_tag2").innerHTML = home_data["tag"];
        document.getElementById("parmenat_txt").innerHTML = home_data["parmenat_txt"];

        let html_chnge_txt = `<span class="txt-rotate" data-period="2000" `;
        html_chnge_txt += `data-rotate='[ `;
        for (let index = 0; index < home_data["cang_txt"].length; index++) {
            const element = home_data["cang_txt"][index];
            if (index != 0) html_chnge_txt += `,`;
            html_chnge_txt += `&quot;${element}&quot;`;
        }
        html_chnge_txt += `]'></span>`;
        document.getElementById("cang_txt").innerHTML = html_chnge_txt;

        //----- conter saction
        for (let index = 0; index < home_data["counter"].length; index++) {
            const element = home_data["counter"][index];
            document.getElementById("container_bar").innerHTML += `
            <div class="col-md-3 col-6">
                <div class="art-counter-frame">
                    <div class="art-counter-box">
                        <span class="art-counter style="opacity: 1;">${element["value"]}</span>
                        <span class="art-counter-plus">${element["mark"]}</span>
                    </div>
                    <h6>
                        <span>${element["text"]} </span>
                    </h6>
                </div>
            </div>
            `;
        }
        document.getElementById("home_tilegrid1_name").innerHTML = home_data["tile_name1"];
        //----- tile1 grid build
        for (let index = 0; index < home_data["tile_grid1"].length; index++) {
            const element = home_data["tile_grid1"][index];
            document.getElementById("home_tilegrid1").innerHTML += `
            <div class="col-lg-4 col-md-6">
                <div
                    class="art-a art-service-icon-box">
                    <div
                        class="art-service-ib-content">
                        <h5 class="mb-15">
                            <span>${element["title"]}</span>
                        </h5>
                        <div class="mb-15">
                            <div><p>${element["text"]}</p> </div>
                        </div>
                        <div class="art-buttons-frame">
                            <a href=${element["link"]} class="art-link art-color-link art-w-chevron">
                                <span>${element["link_name"]}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    `;
        }

        //----- tile2 build
        document.getElementById("home_tile_name2").innerHTML = home_data["tile_name2"];
        for (let index = 0; index < home_data["tile_grid2"].length; index++) {
            const element = home_data["tile_grid2"][index];
            document.getElementById("home_tilegrid2").innerHTML += `
            <div class="col-lg-4">
                <div class="art-a art-price">
                    <div class="art-price-body">
                        <h5 class="mb-30">
                            <span>${element["title"]}</span>
                        </h5>
                        <div class="art-price-cost">
                            <div
                                class="art-number">
                                <span>${element["subtitle"]}</span>
                            </div>
                        </div>
                        <div class="art-price-list">
                            <div>${element["text"]}</div>
                        </div>
                        <a href=${element["link"]} class="art-link art-color-link art-w-chevron">
                            <span>${element["link_name"]}</span>
                        </a>
                    </div>
                </div>
            </div>
            `;
        }

        //----- tile3 build
        document.getElementById("home_tile_name3").innerHTML = home_data["tile_name3"];
        for (let index = 0; index < home_data["tile_grid3"].length; index++) {
            const element = home_data["tile_grid3"][index];
            let html_code =
                `<div class="swiper-slide ">
                <div class="art-a art-testimonial">
                    <div class="testimonial-body">
                        <img alt="Paul Trueman"
                        data-src=${element["pic_url"]}
                            class="art-testimonial-face lazyload"
                            src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img
                                class="art-testimonial-face" src=${element["pic_url"]} alt="Paul Trueman"></noscript>
                        <h5>
                            <span>${element["name"]}</span>
                        </h5>
                        <div class="art-el-suptitle mb-15">
                            <span>${element["post"]}</span>
                        </div>
                        <div class="mb-15 art-el-description">
                            <div>
                                <p>${element["msg"]}</p>
                            </div>
                        </div>
                    </div>
                    <div class="art-testimonial-footer">
                        <div class="art-left-side">
                            <ul class="art-star-rate">
                            `;

            for (let li_index = 0; li_index < 5; li_index++) {
                if (li_index < element["starts"]) {
                    html_code += `<li><i class="fas fa-star" style="color:#ffc107;"></i></li>`;
                }
                else {
                    html_code += `<li><i class="fas fa-star"></i></li>`;
                }
            }
            html_code += `</ul>
                        </div>
                        <div class="art-right-side"> </div>
                    </div>
                </div>
            </div>`;
            document.getElementById("home_tilegrid3").innerHTML += html_code;
        }

        document.querySelector('.arrow-buttom').href = menuItem[1]['subName'][0]['link'];
        document.querySelector('.arrow-buttom .chevron-txt').innerHTML = menuItem[1]['subName'][0]['name'];

        document.getElementById("home_tilegrid3").addEventListener('touchstart', function () { isOnDiv = true; });
        document.getElementById("home_tilegrid3").addEventListener('mousedown', function () { isOnDiv = true; });
        document.getElementById("home_tilegrid3").addEventListener('touchend', function () { isOnDiv = false; });
        document.getElementById("home_tilegrid3").addEventListener('mouseup', function () { isOnDiv = false; });
    }


    if (filename == '/contact.html') {
        // let con_Email = getElementById('your-email').value
        // getElementById('your-name').value
        // getElementById('your-message').value
    }


}


// <----------------------------- E-mail sending funtion ------------------------------------------->
function sendEmail() {
    // <---- stop pgae loading
    event.preventDefault();

    console.log('mail sending!');
    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "maduranga.ayeshmantha@gmail.com",
        Password: "6BC926483EEF49A4DCF82C230531A39B437A",
        To: 'maduranga.ayeshmantha@gmail.com',
        From: "lakshanichathurangi100@gmail.com",
        Subject: "test",
        Body: "test body"
    }).then(
        message => alert(message)
    );
}




// -------------- touch event ------------------
// touch
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
// mouse
document.addEventListener('mousedown', handleClickStart, false);
document.addEventListener('mousemove', handleTouchMove, false);
document.addEventListener('mouseup', handleClickEnd, false);
// --- disable swiper area ------
var isOnDiv = false;
var isMouseOn = false;
var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    if (isOnDiv == false) {
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }
};

function handleClickStart(evt) {
    if (isOnDiv == false) {
        isMouseOn = true;
        xDown = evt.clientX;
        yDown = evt.clientY;
    }
};

function handleClickEnd(evt) {
    if (isOnDiv == false) {
        isMouseOn = false;
        xDown = evt.clientX;
        yDown = evt.clientY;
    }
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }
    var xUp = 0;
    var yUp = 0;
    if (evt.touches == null) {
        if (!isMouseOn) return;
        xUp = evt.clientX;
        yUp = evt.clientY;
    }
    else {
        xUp = evt.touches[0].clientX;
        yUp = evt.touches[0].clientY;
    }

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        let element = document.querySelector('.art-content');
        if (xDiff > 0) {
            /* right swipe */
            if (!(document.querySelector('.art-menu-bar').classList.contains('art-active'))) {
                if (element.classList.contains('art-active')) {
                    document.querySelector('.art-content').classList.remove('art-active');
                    document.querySelector('.art-info-bar').classList.remove('art-active');
                    document.querySelector('.art-menu-bar-btn').classList.remove('art-disabled');
                }
                else {
                    document.querySelector('.art-content').classList.add('art-active');
                    document.querySelector('.art-menu-bar').classList.add('art-active');
                    document.querySelector('.art-menu-bar-btn').classList.add('art-active');
                    document.querySelector('.art-info-bar-btn').classList.add('art-disabled');
                }
            }
        }
        else {
            /* left swipe */
            if (!(document.querySelector('.art-info-bar').classList.contains('art-active'))) {
                if (element.classList.contains('art-active')) {
                    document.querySelector('.art-content').classList.remove('art-active');
                    document.querySelector('.art-menu-bar').classList.remove('art-active');
                    document.querySelector('.art-menu-bar-btn').classList.remove('art-active');
                    document.querySelector('.art-info-bar-btn').classList.remove('art-disabled');
                } else {
                    if (document.documentElement.clientWidth < 1032) {
                        document.querySelector('.art-content').classList.add('art-active');
                        document.querySelector('.art-info-bar').classList.add('art-active');
                        document.querySelector('.art-menu-bar-btn').classList.add('art-disabled');
                    }
                }
            }
        }
    } else {
        if (yDiff > 0) {
            /* down swipe */
            // console.log("down")
        } else {
            /* up swipe */
            // console.log("up")
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

