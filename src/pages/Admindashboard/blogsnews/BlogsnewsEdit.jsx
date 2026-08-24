import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuSave, LuImagePlus } from 'react-icons/lu';
import { blogsnewslist } from '../../../Routes/Routes';

const BlogsnewsEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        readingTime: '',
        category: '',
        status: 'Draft',
        description: '',
        content: '',
        thumbnailUrl: '',
    });

    useEffect(() => {
        if (isEditMode) {
            // Mock fetching data for editing
            setFormData({
                title: 'The Evolution of Malware: From Simple Viruses to Advanced Persistent Threats',
                date: '2026-08-30',
                readingTime: '2 minutes',
                category: 'Malware',
                status: 'Published',
                description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC...',
                content: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old...',
                thumbnailUrl: 'https://picsum.photos/800/400',
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Mock save action
        console.log('Saved data:', formData);
        navigate(blogsnewslist);
    };

    return (
        <div className="container-fluid py-4 h-100 overflow-y-auto" style={{ maxHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button 
                        className="btn btn-light me-3 border-light-subtle" 
                        onClick={() => navigate(blogsnewslist)}
                    >
                        <LuArrowLeft size={18} />
                    </button>
                    <h2 className="mb-0 fs-4">{isEditMode ? 'Edit Blog / News' : 'Create New Blog / News'}</h2>
                </div>
                <button 
                    className="btn btn-primary d-flex align-items-center px-4" 
                    onClick={handleSave}
                >
                    <LuSave className="me-2" size={16} /> {isEditMode ? 'Update' : 'Publish'}
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4">Main Content</h5>
                            
                            <div className="mb-4">
                                <label className="form-label fw-medium">Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter blog/news title" 
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-medium">Short Description</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter a brief summary (shows on list view)"
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Full Content</label>
                                <textarea 
                                    className="form-control" 
                                    rows="12"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your article content here..."
                                ></textarea>
                         
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4">Metadata & Publishing</h5>
                            
                            <div className="mb-3">
                                <label className="form-label fw-medium">Status</label>
                                <select 
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Category</label>
                                <select 
                                    className="form-select"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Malware">Malware</option>
                                    <option value="Phishing">Phishing</option>
                                    <option value="Tech News">Tech News</option>
                                    <option value="Company Update">Company Update</option>
                                    <option value="Vulnerability">Vulnerability</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Date</label>
                                <input 
                                    type="date" 
                                    className="form-control"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Reading Time</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    name="readingTime"
                                    value={formData.readingTime}
                                    onChange={handleChange}
                                    placeholder="e.g. 2 minutes"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4">Media</h5>
                            
                            <div className="mb-3">
                                <label className="form-label fw-medium">Featured Image</label>
                                {formData.thumbnailUrl ? (
                                    <div className="mb-3 position-relative">
                                        <img 
                                            src={formData.thumbnailUrl} 
                                            alt="Preview" 
                                            className="img-fluid rounded" 
                                            style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                        />
                                        <button 
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                            onClick={() => setFormData({...formData, thumbnailUrl: ''})}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border border-dashed rounded p-4 text-center bg-light">
                                        <LuImagePlus className="text-muted mb-2" size={32} />
                                        <p className="text-muted small mb-0">Click to upload or drag and drop</p>
                                        <input type="file" className="d-none" id="imageUpload" />
                                        <label htmlFor="imageUpload" className="btn btn-sm btn-outline-primary mt-2">
                                            Select File
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogsnewsEdit;
