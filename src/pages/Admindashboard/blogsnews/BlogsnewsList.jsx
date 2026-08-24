import React, { useMemo } from 'react';
import { LuPlus, LuPenLine, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/Adminpages/bloglist/BlogsnewsList.scss';

// Generate mock data for the last 30 days
const generateMockData = () => {
    const categories = ['Malware', 'Phishing', 'Tech News', 'Company Update', 'Vulnerability'];
    const statuses = ['Published', 'Draft'];
    const data = []; 
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const itemDate = new Date(today);
        itemDate.setDate(today.getDate() - i);
        data.push({
            id: `BLOG-${1000 + i}`,
            title: `Sample Security Blog or News Title ${i + 1}`,
            date: itemDate.toISOString().split('T')[0],
            category: categories[i % categories.length],
            status: statuses[i % statuses.length],
            thumbnail: `https://picsum.photos/seed/${i}/200/120`,
            description: `This is a short description for the blog post ${i + 1}. It covers recent updates and threats in the security landscape.`
        });
    }
    return data;
};

const mockData = generateMockData();

const BlogsnewsList = () => {
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const navigate = useNavigate();

    // Filter logic
    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            const matchDate = selectedDate ? item.date === selectedDate : true;
            const matchCategory = selectedCategory ? item.category === selectedCategory : true;
            return matchDate && matchCategory;
        });
    }, [selectedDate, selectedCategory]);

    const handleDateChange = (e) => setSelectedDate(e.target.value);
    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
    const handleCreate = () => navigate('/blog-news-add');
    const handleEdit = (id) => navigate(`/blog-news-edit/${id}`);

    const getCategoryClass = (category) => {
        switch (category) {
            case 'Malware': return 'malware';
            case 'Phishing': return 'phishing';
            case 'Tech News': return 'tech-news';
            case 'Vulnerability': return 'vulnerability';
            default: return 'default';
        }
    };

    const getStatusClass = (status) => {
        return status === 'Published' ? 'published' : 'draft';
    };

    return (
        <div className="container-fluid py-4 blogsnews-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0 page-title">Blogs and News</h2>
                <button className="btn add-new-btn d-flex align-items-center px-4 py-2" onClick={handleCreate}>
                    <LuPlus className="me-2" size={16} /> Add New
                </button>
            </div>

            {/* Toolbar */}
            <div className="card mb-4 toolbar-card">
                <div className="card-body py-2 px-3">
                    <div className="d-flex flex-wrap align-items-center gap-4">
                        <div className="d-flex align-items-center">
                            <span className="me-2 text-muted small">Date:</span>
                            <input
                                type="date"
                                className="form-control toolbar-input text-muted"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="me-2 text-muted small">Category:</span>
                            <select
                                className="form-select toolbar-input text-dark"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                style={{ minWidth: '150px' }}
                            >
                                <option value="">All Categories</option>
                                <option value="Malware">Malware</option>
                                <option value="Phishing">Phishing</option>
                                <option value="Tech News">Tech News</option>
                                <option value="Company Update">Company Update</option>
                                <option value="Vulnerability">Vulnerability</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card table-card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0 text-nowrap">
                        <thead className="table-header">
                            <tr>
                                <th className="py-3 px-4">THUMBNAIL</th>
                                <th className="py-3">TITLE</th>
                                <th className="py-3">CATEGORY</th>
                                <th className="py-3">DATE</th>
                                <th className="py-3">STATUS</th>
                                <th className="py-3 text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? filteredData.slice(0, 4).map(item => (
                                <tr key={item.id} className="table-row">
                                    <td className="px-4 py-3">
                                        <img src={item.thumbnail} alt="thumbnail" style={{ width: 120, height: 68, objectFit: 'cover' }} />
                                    </td>
                                    <td className="py-3">
                                        <span className="title-text">{item.title}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className={`category-badge ${getCategoryClass(item.category)}`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-3 text-muted" style={{ fontSize: '13px' }}>
                                        {item.date}
                                    </td>
                                    <td className="py-3">
                                        <span className={`status-badge ${getStatusClass(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button className="btn btn-sm btn-light text-primary border-light-subtle" onClick={() => handleEdit(item.id)} title="Edit">
                                                <LuPenLine size={15} />
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger border-light-subtle" title="Delete">
                                                <LuTrash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        No articles found for the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="text-muted" style={{ fontSize: '13px' }}>Showing 1 to 4 of 24 entries</span>
                <ul className="pagination pagination-custom mb-0">
                    <li className="page-item"><a className="page-link" href="#">&lt;</a></li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item"><a className="page-link" href="#">&gt;</a></li>
                </ul>
            </div>
        </div>
    );
};

export default BlogsnewsList;
