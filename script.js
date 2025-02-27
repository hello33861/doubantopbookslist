// 全局变量
let allBooks = [];
let allTags = [];
let filteredBooks = [];
let currentTag = 'all';
let currentSort = 'rating-desc';
let searchQuery = '';

// 在script.js文件中添加标签分类定义
const tagCategories = {
    "文学": [
        "小说", "文学", "外国文学", "经典",
        "中国文学", "随笔", "日本文学", "散文",
        "村上春树", "诗歌", "童话", "名著",
        "儿童文学", "古典文学", "余华", "王小波",
        "当代文学", "杂文", "张爱玲", "外国名著",
        "鲁迅", "钱钟书", "诗词", "茨威格",
        "米兰·昆德拉", "杜拉斯", "港台"
    ],
    "流行": [
        "漫画", "推理", "绘本", "悬疑",
        "科幻", "东野圭吾", "青春", "言情",
        "推理小说", "奇幻", "日本漫画", "武侠",
        "耽美", "科幻小说", "网络小说", "三毛",
        "韩寒", "亦舒", "阿加莎·克里斯蒂", "金庸",
        "穿越", "安妮宝贝", "轻小说", "魔幻",
        "郭敬明", "青春文学", "几米", "J.K.罗琳",
        "幾米", "校园", "张小娴", "古龙",
        "高木直子", "沧月", "余秋雨", "王朔"
    ],
    "文化": [
        "历史", "心理学", "哲学", "社会学",
        "传记", "文化", "艺术", "社会",
        "政治", "设计", "政治学", "宗教",
        "电影", "中国历史", "建筑", "数学",
        "回忆录", "思想", "人物传记", "艺术史",
        "国学", "人文", "音乐", "绘画",
        "戏剧", "西方哲学", "近代史", "二战",
        "军事", "佛教", "考古", "自由主义",
        "美术"
    ],
    "生活": [
        "爱情", "成长", "生活", "心理",
        "女性", "旅行", "励志", "教育",
        "摄影", "职场", "美食", "游记",
        "健康", "灵修", "情感", "人际关系",
        "两性", "养生", "手工", "家居",
        "自助游"
    ],
    "经管": [
        "经济学", "管理", "经济", "商业",
        "金融", "投资", "营销", "理财",
        "创业", "股票", "广告", "企业史",
        "策划"
    ],
    "科技": [
        "科普", "互联网", "科学", "编程",
        "交互设计", "算法", "用户体验", "科技",
        "web", "交互", "通信", "UE",
        "神经网络", "UCD", "程序"
    ]
};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const booksContainer = document.getElementById('booksContainer');
    const tagContainer = document.getElementById('tagContainer');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const selectAllTagsBtn = document.getElementById('selectAllTags');
    const deselectAllTagsBtn = document.getElementById('deselectAllTags');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const statsInfo = document.getElementById('statsInfo');
    
    // 存储数据和筛选状态
    let allBooks = [];
    let allTags = [];
    let selectedTags = new Set();
    let searchTerm = '';
    let currentSort = 'rating-desc';
    
    // 加载数据
    fetch('books.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
            allBooks = data.books;
            allTags = data.tags;
            
            // 初始化标签
            renderTags();
            
            // 初始化书籍列表
            updateBooksList();
            
            // 添加事件监听器
            searchInput.addEventListener('input', function() {
                searchTerm = this.value.trim().toLowerCase();
                updateBooksList();
            });
            
            sortSelect.addEventListener('change', function() {
                currentSort = this.value;
                updateBooksList();
            });
            
            selectAllTagsBtn.addEventListener('click', function() {
                selectedTags = new Set(allTags);
                renderTags();
                updateBooksList();
            });
            
            deselectAllTagsBtn.addEventListener('click', function() {
                selectedTags.clear();
                renderTags();
                updateBooksList();
            });
            
            resetFiltersBtn.addEventListener('click', function() {
                selectedTags.clear();
                searchInput.value = '';
                searchTerm = '';
                sortSelect.value = 'rating-desc';
                currentSort = 'rating-desc';
                renderTags();
                updateBooksList();
            });
        })
        .catch(error => {
            console.error('获取数据时出错:', error);
            booksContainer.innerHTML = `
                <div class="alert alert-danger">
                    加载数据失败: ${error.message}
                    <br><br>
                    请确保已运行 csv_to_json.py 脚本生成 books.json 文件。
                </div>
            `;
            tagContainer.innerHTML = `<div class="alert alert-danger">加载标签失败</div>`;
            statsInfo.innerHTML = `<div class="alert alert-danger">加载数据失败</div>`;
        });
    
    // 渲染标签
    function renderTags() {
        const tagContainer = document.getElementById('tagContainer');
        const tagAccordion = document.getElementById('tagAccordion');
        
        // 保存当前展开的分类ID
        const expandedCategories = [];
        document.querySelectorAll('.accordion-collapse.show').forEach(item => {
            expandedCategories.push(item.id);
        });
        
        tagAccordion.innerHTML = '';
        
        // 创建"所有标签"分类
        const allTagsCount = {};
        allTags.forEach(tag => {
            allTagsCount[tag] = allBooks.filter(book => 
                book.tags && book.tags.includes(tag)
            ).length;
        });
        
        // 为每个分类创建一个折叠面板
        let accordionIndex = 0;
        for (const [category, categoryTags] of Object.entries(tagCategories)) {
            // 过滤出在当前数据中存在的标签
            const existingTags = categoryTags.filter(tag => allTags.includes(tag));
            if (existingTags.length === 0) continue;
            
            // 计算该分类下选中的标签数量
            const selectedInCategory = existingTags.filter(tag => selectedTags.has(tag)).length;
            
            // 创建分类折叠面板
            const categoryId = `category-${accordionIndex}`;
            const collapseId = `collapse-${categoryId}`;
            
            // 检查此分类是否应该展开
            // 如果有选中的标签或之前是展开状态，则展开
            const shouldExpand = selectedInCategory > 0 || 
                                 expandedCategories.includes(collapseId) || 
                                 accordionIndex === 0 && expandedCategories.length === 0;
            
            const categoryItem = document.createElement('div');
            categoryItem.className = 'accordion-item';
            categoryItem.innerHTML = `
                <h2 class="accordion-header" id="heading-${categoryId}">
                    <button class="accordion-button ${shouldExpand ? '' : 'collapsed'}" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#${collapseId}" 
                            aria-expanded="${shouldExpand ? 'true' : 'false'}" 
                            aria-controls="${collapseId}">
                        ${category} 
                        <span class="ms-2 badge bg-secondary">${existingTags.length}</span>
                        ${selectedInCategory > 0 ? `<span class="ms-2 badge bg-success">${selectedInCategory} 已选</span>` : ''}
                    </button>
                </h2>
                <div id="${collapseId}" 
                     class="accordion-collapse collapse ${shouldExpand ? 'show' : ''}" 
                     aria-labelledby="heading-${categoryId}" 
                     data-bs-parent="#tagAccordion">
                    <div class="accordion-body category-tags">
                        <!-- 标签将在这里动态添加 -->
                    </div>
                </div>
            `;
            
            tagAccordion.appendChild(categoryItem);
            
            // 添加该分类下的标签
            const categoryTagsContainer = categoryItem.querySelector('.category-tags');
            existingTags.forEach(tag => {
                const tagBadge = document.createElement('span');
                tagBadge.className = `badge tag-badge ${selectedTags.has(tag) ? 'active' : ''}`;
                tagBadge.innerHTML = `${tag} <span class="tag-count">(${allTagsCount[tag]})</span>`;
                tagBadge.addEventListener('click', function() {
                    if (selectedTags.has(tag)) {
                        selectedTags.delete(tag);
                    } else {
                        selectedTags.add(tag);
                    }
                    this.classList.toggle('active');
                    updateBooksList();
                    renderTags(); // 重新渲染标签以更新选中状态
                });
                categoryTagsContainer.appendChild(tagBadge);
                categoryTagsContainer.appendChild(document.createTextNode(' '));
            });
            
            accordionIndex++;
        }
        
        // 创建"其他标签"分类，包含未分类的标签
        const categorizedTags = new Set(Object.values(tagCategories).flat());
        const uncategorizedTags = allTags.filter(tag => !categorizedTags.has(tag));
        
        if (uncategorizedTags.length > 0) {
            const selectedInOthers = uncategorizedTags.filter(tag => selectedTags.has(tag)).length;
            
            const othersId = `category-others`;
            const collapseOthersId = `collapse-${othersId}`;
            
            // 检查"其他"分类是否应该展开
            const shouldExpandOthers = selectedInOthers > 0 || 
                                      expandedCategories.includes(collapseOthersId);
            
            const othersItem = document.createElement('div');
            othersItem.className = 'accordion-item';
            othersItem.innerHTML = `
                <h2 class="accordion-header" id="heading-${othersId}">
                    <button class="accordion-button ${shouldExpandOthers ? '' : 'collapsed'}" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#${collapseOthersId}" 
                            aria-expanded="${shouldExpandOthers ? 'true' : 'false'}" 
                            aria-controls="${collapseOthersId}">
                        其他标签
                        <span class="ms-2 badge bg-secondary">${uncategorizedTags.length}</span>
                        ${selectedInOthers > 0 ? `<span class="ms-2 badge bg-success">${selectedInOthers} 已选</span>` : ''}
                    </button>
                </h2>
                <div id="${collapseOthersId}" 
                     class="accordion-collapse collapse ${shouldExpandOthers ? 'show' : ''}" 
                     aria-labelledby="heading-${othersId}" 
                     data-bs-parent="#tagAccordion">
                    <div class="accordion-body category-tags">
                        <!-- 未分类标签将在这里动态添加 -->
                    </div>
                </div>
            `;
            
            tagAccordion.appendChild(othersItem);
            
            // 添加未分类的标签
            const othersTagsContainer = othersItem.querySelector('.category-tags');
            uncategorizedTags.forEach(tag => {
                const tagBadge = document.createElement('span');
                tagBadge.className = `badge tag-badge ${selectedTags.has(tag) ? 'active' : ''}`;
                tagBadge.innerHTML = `${tag} <span class="tag-count">(${allTagsCount[tag]})</span>`;
                tagBadge.addEventListener('click', function() {
                    if (selectedTags.has(tag)) {
                        selectedTags.delete(tag);
                    } else {
                        selectedTags.add(tag);
                    }
                    this.classList.toggle('active');
                    updateBooksList();
                    renderTags(); // 重新渲染标签以更新选中状态
                });
                othersTagsContainer.appendChild(tagBadge);
                othersTagsContainer.appendChild(document.createTextNode(' '));
            });
        }
    }
    
    // 更新书籍列表
    function updateBooksList() {
        // 筛选书籍
        let filteredBooks = allBooks;
        
        // 按标签筛选
        if (selectedTags.size > 0) {
            filteredBooks = filteredBooks.filter(book => {
                if (!book.tags || book.tags.length === 0) return false;
                
                // 检查书籍的标签是否与选中的标签有交集
                for (const tag of book.tags) {
                    if (selectedTags.has(tag)) return true;
                }
                return false;
            });
        }
        
        // 按搜索词筛选
        if (searchTerm) {
            filteredBooks = filteredBooks.filter(book => {
                return (
                    (book.title && book.title.toLowerCase().includes(searchTerm)) ||
                    (book.author && book.author.toLowerCase().includes(searchTerm)) ||
                    (book.publisher && book.publisher.toLowerCase().includes(searchTerm)) ||
                    (book.intro && book.intro.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        // 排序
        filteredBooks.sort((a, b) => {
            const ratingA = parseFloat(a.rating) || 0;
            const ratingB = parseFloat(b.rating) || 0;
            const votesA = parseInt(a.votes) || 0;
            const votesB = parseInt(b.votes) || 0;
            
            switch (currentSort) {
                case 'rating-desc':
                    return ratingB - ratingA;
                case 'rating-asc':
                    return ratingA - ratingB;
                case 'votes-desc':
                    return votesB - votesA;
                case 'votes-asc':
                    return votesA - votesB;
                default:
                    return ratingB - ratingA;
            }
        });
        
        // 更新统计信息
        statsInfo.innerHTML = `
            <strong>统计信息:</strong> 共找到 ${filteredBooks.length} 本书籍
            ${selectedTags.size > 0 ? `(已选择 ${selectedTags.size} 个标签)` : ''}
            ${searchTerm ? `(搜索词: "${searchTerm}")` : ''}
        `;
        
        // 渲染书籍
        if (filteredBooks.length === 0) {
            booksContainer.innerHTML = `
                <div class="no-results">
                    <p>没有找到符合条件的书籍</p>
                    <button class="btn btn-outline-secondary" onclick="document.getElementById('resetFilters').click()">
                        重置筛选条件
                    </button>
                </div>
            `;
            return;
        }
        
        booksContainer.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4';
        
        filteredBooks.forEach(book => {
            const col = document.createElement('div');
            col.className = 'col';
            
            // 默认图片和实际图片URL
            const defaultImgUrl = 'https://img9.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-medium.gif';
            const imgUrl = book.img_url || defaultImgUrl;
            
            // 将评分转换为星星显示
            const rating = parseFloat(book.rating) || 0;
            const fullStars = Math.floor(rating / 2);
            const halfStar = (rating % 2) >= 1 ? 1 : 0;
            const emptyStars = 5 - fullStars - halfStar;
            
            // 生成星星HTML
            let starsHtml = '';
            for (let i = 0; i < fullStars; i++) {
                starsHtml += '<span class="full-star">★</span>';
            }
            if (halfStar) {
                starsHtml += '<span class="half-star"></span>';
            }
            for (let i = 0; i < emptyStars; i++) {
                starsHtml += '<span class="empty-star">☆</span>';
            }
            
            col.innerHTML = `
                <div class="card book-card">
                    <div class="card-img-container">
                        <img class="card-img-top lazy-image" 
                             src="${defaultImgUrl}" 
                             data-src="${imgUrl}" 
                             alt="${book.title}" 
                             loading="lazy"
                             onerror="this.src='${defaultImgUrl}'">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${book.title || '未知标题'}</h5>
                        <p class="card-text">${book.author || '未知作者'}</p>
                        <p class="card-text">出版社: ${book.publisher || '未知'}</p>
                        <p class="card-text rating-stars">
                            <span class="stars">${starsHtml}</span>
                            <span class="rating-text">${rating.toFixed(1)}</span>
                            <small>(${book.votes || '0'}人评价)</small>
                        </p>
                        <p class="card-text intro-text">${book.intro || '暂无简介'}</p>
                        <div class="book-tags">
                            ${(book.tags || []).map(tag => `<span class="book-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="mt-2">
                            <a href="${book.book_url}" target="_blank" class="btn btn-sm btn-outline-success">查看详情</a>
                        </div>
                    </div>
                </div>
            `;
            
            row.appendChild(col);
        });
        
        booksContainer.appendChild(row);
        
        // 初始化懒加载
        initLazyLoading();
    }
    
    // 添加懒加载初始化函数
    function initLazyLoading() {
        // 使用Intersection Observer API实现懒加载
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy-image');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('.lazy-image');
            lazyImages.forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // 回退方案：对于不支持IntersectionObserver的浏览器
            // 立即加载所有图片
            const lazyImages = document.querySelectorAll('.lazy-image');
            lazyImages.forEach(lazyImage => {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy-image');
            });
        }
    }
});

// 初始化标签云
function initTagCloud() {
    const tagCloud = document.getElementById('tag-cloud');
    
    // 按标签下的书籍数量排序
    const tagCounts = {};
    allTags.forEach(tag => {
        tagCounts[tag] = allBooks.filter(book => 
            book.tags && book.tags.includes(tag)
        ).length;
    });
    
    const sortedTags = allTags.sort((a, b) => tagCounts[b] - tagCounts[a]);
    
    // 只显示前50个最常见的标签
    const displayTags = sortedTags.slice(0, 50);
    
    displayTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.dataset.tag = tag;
        tagElement.textContent = `${tag} (${tagCounts[tag]})`;
        
        tagElement.addEventListener('click', () => {
            // 移除所有标签的active类
            document.querySelectorAll('.tag').forEach(el => {
                el.classList.remove('active');
            });
            
            // 添加active类到当前标签
            tagElement.classList.add('active');
            
            // 更新当前标签并重新渲染
            currentTag = tag;
            filterAndRenderBooks();
        });
        
        tagCloud.appendChild(tagElement);
    });
}

// 处理搜索
function handleSearch() {
    const input = document.getElementById('search-input');
    searchQuery = input.value.trim().toLowerCase();
    filterAndRenderBooks();
}

// 过滤并渲染书籍
function filterAndRenderBooks() {
    // 根据标签和搜索词过滤
    filteredBooks = allBooks.filter(book => {
        // 标签过滤
        const passesTagFilter = currentTag === 'all' || 
            (book.tags && book.tags.includes(currentTag));
        
        // 搜索词过滤
        const passesSearchFilter = !searchQuery || 
            book.title.toLowerCase().includes(searchQuery) || 
            (book.author && book.author.toLowerCase().includes(searchQuery));
        
        return passesTagFilter && passesSearchFilter;
    });
    
    // 排序并渲染
    sortBooks();
    renderBooks();
    updateStats();
}

// 排序书籍
function sortBooks() {
    switch (currentSort) {
        case 'rating-desc':
            filteredBooks.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            break;
        case 'rating-asc':
            filteredBooks.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
            break;
        case 'votes-desc':
            filteredBooks.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
            break;
        case 'votes-asc':
            filteredBooks.sort((a, b) => parseInt(a.votes) - parseInt(b.votes));
            break;
    }
}

// 渲染书籍
function renderBooks() {
    const booksGrid = document.getElementById('books-grid');
    booksGrid.innerHTML = '';
    
    if (filteredBooks.length === 0) {
        document.getElementById('no-results').style.display = 'flex';
        return;
    }
    
    document.getElementById('no-results').style.display = 'none';
    
    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.addEventListener('click', () => showBookDetail(book));
        
        // 默认封面图片
        let coverUrl = book.img_url || 'https://via.placeholder.com/200x300?text=No+Cover';
        
        // 限制显示的标签数量
        const displayTags = book.tags && book.tags.length > 0 
            ? book.tags.slice(0, 3) 
            : [];
        
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${coverUrl}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover'">
                <div class="book-rating">${book.rating}</div>
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author || '未知作者'}</div>
                <div class="book-meta">
                    <div class="book-votes">
                        <i class="fas fa-user"></i> ${book.votes}人评价
                    </div>
                </div>
                ${displayTags.length > 0 ? `
                <div class="book-tags">
                    ${displayTags.map(tag => `<span class="book-tag">${tag}</span>`).join('')}
                </div>` : ''}
            </div>
        `;
        
        booksGrid.appendChild(bookCard);
    });
}

// 显示书籍详情
function showBookDetail(book) {
    const modalBody = document.getElementById('modal-body');
    
    // 默认封面图片
    let coverUrl = book.img_url || 'https://via.placeholder.com/200x300?text=No+Cover';
    
    modalBody.innerHTML = `
        <div class="book-detail">
            <div class="book-detail-cover">
                <img src="${coverUrl}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover'">
            </div>
            <div class="book-detail-info">
                <h2 class="book-detail-title">${book.title}</h2>
                <div class="book-detail-author">${book.author || '未知作者'}</div>
                
                <div class="book-detail-meta">
                    <div class="book-detail-rating">
                        <i class="fas fa-star"></i> ${book.rating}
                    </div>
                    <div class="book-detail-votes">
                        <i class="fas fa-user"></i> ${book.votes}人评价
                    </div>
                </div>
                
                <div class="book-detail-publisher">
                    ${book.publisher ? `出版社: ${book.publisher}` : ''}
                    ${book.pub_date ? ` | 出版日期: ${book.pub_date}` : ''}
                </div>
                
                ${book.tags && book.tags.length > 0 ? `
                <div class="book-detail-tags">
                    ${book.tags.map(tag => `<span class="book-detail-tag">${tag}</span>`).join('')}
                </div>` : ''}
                
                ${book.intro ? `
                <div class="book-detail-intro">
                    <h3>内容简介</h3>
                    <p>${book.intro}</p>
                </div>` : ''}
                
                <a href="${book.book_url}" target="_blank" class="book-detail-link">
                    <i class="fas fa-external-link-alt"></i> 在豆瓣查看
                </a>
            </div>
        </div>
    `;
    
    document.getElementById('book-modal').style.display = 'block';
}

// 更新统计信息
function updateStats() {
    document.getElementById('total-books').textContent = allBooks.length;
    document.getElementById('displayed-books').textContent = filteredBooks.length;
    
    // 计算平均评分
    if (filteredBooks.length > 0) {
        const totalRating = filteredBooks.reduce((sum, book) => sum + parseFloat(book.rating), 0);
        const averageRating = (totalRating / filteredBooks.length).toFixed(1);
        document.getElementById('average-rating').textContent = averageRating;
    } else {
        document.getElementById('average-rating').textContent = '0';
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
} 