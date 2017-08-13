
var listWrapper = document.querySelector('.list-wrapper-hook'),
    listContent = document.querySelector('.list-content-hook'),
    alert = document.querySelector('.alert-hook'),
    topTip = document.querySelector('.refresh-hook'),
    bottomTip = document.querySelector('.loading-hook'),
    container=$(listWrapper);
/*
 * 此处可优化,定义一个变量,记录用户滑动的状态,初始值为0,滑动中为1,滑动结束、数据请求成功重置为0
 * 防止用户刷新列表http请求过多
*/

function imglazy() {
  $('img.lazy').lazyload({
    effect: 'fadeIn',
    //threshold : 400,
    container: container
  }).on('load',function () {
    $(this).removeClass('lazy');
  });
}


function initScroll() {
    scroll = new window.BScroll(listWrapper, {
    probeType: 1,
  });
  // 滑动中
  scroll.on('scroll', function (position) {
    container.trigger('scroll');
    if(position.y > 50) {
      topTip.innerText = '释放立即刷新';
    }else if(position.y<this.maxScrollY-50){
      bottomTip.innerText = '释放加载更多';
    }else if(position.y<0 && position.y>this.maxScrollY-50){
      bottomTip.innerText = '上拉加载更多';
    }

  });
  scroll.on('scrollEnd',function () {
    container.trigger('scroll');

  });
  /*
   * @ touchend:滑动结束的状态
   * @ maxScrollY:屏幕最大滚动高度
  */ 
  // 滑动结束
  scroll.on('touchend', function (position) {
    var that=this;
    if (position.y > 50) {
      
      setTimeout(function () {
        /*
         * 这里发送ajax刷新数据
         * 刷新后,后台只返回第1页的数据,无论用户是否已经上拉加载了更多
        */
        // 恢复文本值
        topTip.innerText = '下拉刷新';
        // 刷新成功后的提示
        refreshAlert('刷新成功');
        // 刷新列表后,重新计算滚动区域高度
        scroll.refresh();
      }, 1000);
    }else if(position.y < (this.maxScrollY - 50)) {
      bottomTip.innerText = '加载中...';
      setTimeout(function () {
        // 恢复文本值 
        bottomTip.innerText = '上拉加载更多';
        // 向列表添加数据
        reloadData();
        // 加载更多后,重新计算滚动区域高度
        scroll.refresh();
        imglazy();
      }, 1000);
    }
  });
}

initScroll();
imglazy()

// 加载更多方法
function reloadData() {
  var template = '<li class="list-item"><div class="avatar"><img class="lazy" data-original="img/6.jpeg" width="100" height="100" /></div>'+
          '<div class="text"><h2>只会放肆,不会说谎,好青春也是谁不想要一个深情却刺激</h2><span>2016-11-23</span></div></li><li class="list-item"><div class="avatar"><img class="lazy" data-original="img/7.jpeg" width="100" height="100" /></div>'+
      '<div class="text"><h2>只会放肆,不会说谎,好青春也是谁不想要一个深情却刺激</h2><span>2016-11-23</span></div></li><li class="list-item"><div class="avatar"><img class="lazy" data-original="img/8.jpeg" width="100" height="100" /></div>'+
      '<div class="text"><h2>只会放肆,不会说谎,好青春也是谁不想要一个深情却刺激</h2><span>2016-11-23</span></div></li><li class="list-item"><div class="avatar"><img class="lazy" data-original="img/9.jpeg" width="100" height="100" /></div>'+
      '<div class="text"><h2>只会放肆,不会说谎,好青春也是谁不想要一个深情却刺激</h2><span>2016-11-23</span></div></li>'
  // 向ul容器中添加内容
  listContent.innerHTML = listContent.innerHTML + template;
}

// 刷新成功提示方法
function refreshAlert(text) {
  text = text || '操作成功';
  alert.innerHtml = text;
  alert.style.display = 'block';
  setTimeout(function(){
    alert.style.display = 'none';
  },1000);
}


