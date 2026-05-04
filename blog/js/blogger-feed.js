/* js/blogger-feed.js */

const POSTS_PER_LOAD = 9; 
let allPosts = []; 
let currentIndex = 0; 
let isInternalLoading = false; // Prevent multiple triggers at once

/* --- UTILITIES --- */

function getHighResImg(url) {
    if (!url) return 'https://placehold.co/600x400/1e293b/FFF?text=No+Image';
    return url.replace(/\/s[0-9]+.*-c\//, '/w600-h340-p-k-no-nu/')
              .replace(/\/s72-c\//, '/w600-h340-p-k-no-nu/');
}

function getReadTime(content) {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
}

function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
}

function injectJsonLd(posts) {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "blogPosts": posts.map(p => ({
            "@type": "BlogPosting",
            "headline": p.title.$t,
            "datePublished": p.published.$t,
            "image": p.media$thumbnail ? p.media$thumbnail.url : "",
            "url": p.link.find(l => l.rel === 'alternate').href,
            "author": { "@type": "Person", "name": p.author[0].name.$t }
        }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

/* --- MAIN LOGIC --- */

window.handleBloggerFeed = function(data) {
    const entries = data.feed.entry || [];
    allPosts = entries.filter(entry => entry.title && entry.title.$t);

    if (allPosts.length === 0) {
        document.getElementById('postsGrid').innerHTML = '<div style="grid-column:1/-1; text-align:center;">No posts found.</div>';
        hideLoader();
        return;
    }

    injectJsonLd(allPosts.slice(0, 20));
    renderPopularSidebar(allPosts.slice(0, 10));

    // 1. Load the first batch immediately
    currentIndex = 0; 
    loadMorePosts();

    // 2. Setup Auto-Scroll Observer
    setupInfiniteScroll();
};

function loadMorePosts() {
    if (isInternalLoading) return;
    isInternalLoading = true;

    const grid = document.getElementById('postsGrid');
    const nextBatch = allPosts.slice(currentIndex, currentIndex + POSTS_PER_LOAD);
    
    // Check if we reached the end
    if (nextBatch.length === 0) {
        hideLoader();
        return;
    }

    nextBatch.forEach((p) => {
        const link = p.link.find(l => l.rel === 'alternate').href;
        const title = p.title.$t;
        const img = p.media$thumbnail ? getHighResImg(p.media$thumbnail.url) : 'https://placehold.co/600x400/1e293b/FFF?text=Blog';
        const snippet = p.summary?.$t.substring(0, 100) || p.content?.$t.replace(/<[^>]*>/g, '').substring(0, 100);
        const label = p.category && p.category.length > 0 ? p.category[0].term : 'Tech';
        
        const articleHTML = `
            <article class="blog-card fade-in">
                <a href="${link}" class="card-img-wrap">
                    <img src="${img}" alt="${title}" loading="lazy">
                    <span class="card-tag">${label}</span>
                </a>
                <div class="card-content">
                    <div class="card-date">${formatDate(p.published.$t)}</div>
                    <h2 class="card-title"><a href="${link}">${title}</a></h2>
                    <p class="card-desc">${snippet}...</p>
                    <a href="${link}" class="card-read">Read More →</a>
                </div>
            </article>
        `;
        grid.insertAdjacentHTML('beforeend', articleHTML);
    });

    currentIndex += POSTS_PER_LOAD;
    isInternalLoading = false;

    // If we have loaded everything, hide the loader div
    if (currentIndex >= allPosts.length) {
        hideLoader();
    }
}

/* --- INFINITE SCROLL OBSERVER --- */
function setupInfiniteScroll() {
    const sentinel = document.querySelector('.load-more-div');
    if (!sentinel) return;

    // Change button text to a loading indicator
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
        btn.innerHTML = '<span class="loading-spinner"></span> Loading...';
        btn.style.pointerEvents = 'none'; // Disable clicking
        btn.style.background = 'transparent'; 
        btn.style.color = 'var(--text-secondary)';
        btn.style.boxShadow = 'none';
    }

    const observer = new IntersectionObserver((entries) => {
        // If the sentinel (bottom div) is visible, load more
        if (entries[0].isIntersecting) {
            // Small delay to make it feel natural, not instant glitch
            setTimeout(() => {
                loadMorePosts();
            }, 300);
        }
    }, {
        root: null,
        rootMargin: '100px', // Trigger 100px before reaching the exact bottom
        threshold: 0.1
    });

    observer.observe(sentinel);
}

function hideLoader() {
    const div = document.querySelector('.load-more-div');
    if (div) div.style.display = 'none';
}

/* --- SIDEBAR LOGIC --- */
function renderPopularSidebar(posts) {
    const container = document.getElementById('popularPostsList');
    if (!container) return;
    let html = '';
    posts.forEach((p, index) => {
        const link = p.link.find(l => l.rel === 'alternate').href;
        const title = p.title.$t;
        html += `
            <div class="pop-item">
                <div class="pop-number">${index + 1}</div>
                <div class="pop-info">
                    <a href="${link}" class="pop-title">${title}</a>
                    <span class="pop-date">${formatDate(p.published.$t)}</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}