
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Customer = () => {
    const [custlist, setCustList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [permissions, setPermissions] = useState({
        canEdit: false,
        canView: false,
        canAdd: false,
        canRemove: false
    });
    
    const navigate = useNavigate();

    const loadCustomers = () => {
        fetch("http://localhost:8000/customer")
            .then(res => res.json())
            .then(data => setCustList(data))
            .catch(() => toast.error("Failed to load customers"));
    };

    const handleRemove = (id) => {
        if (permissions.canRemove) {
            fetch(`http://localhost:8000/customer/${id}`, {
                method: "DELETE"
            })
            .then(res => {
                if (res.ok) {
                    loadCustomers();
                    toast.success('Customer Removed Successfully');
                }
            })
            .catch(() => toast.error("Failed to remove customer"));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdd = () => {
        if (permissions.canAdd) {
            const newCustomer = {
                code: custlist.length + 1,
                name: formData.name,
                email: formData.email
            };

            fetch("http://localhost:8000/customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCustomer)
            })
            .then(res => {
                if (res.ok) {
                    loadCustomers();
                    setShowAddForm(false);
                    setFormData({ name: '', email: '' });
                    toast.success('Customer Added Successfully');
                }
            })
            .catch(() => toast.error("Failed to add customer"));
        }
    };

    const handleEdit = (customer) => {
        if (permissions.canEdit) {
            if (editId === customer.id) {
                const updatedCustomer = {
                    ...customer,
                    name: formData.name,
                    email: formData.email
                };

                fetch(`http://localhost:8000/customer/${customer.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedCustomer)
                })
                .then(res => {
                    if (res.ok) {
                        loadCustomers();
                        setEditId(null);
                        setFormData({ name: '', email: '' });
                        toast.success('Customer Updated Successfully');
                    }
                })
                .catch(() => toast.error("Failed to update customer"));
            } else {
                setEditId(customer.id);
                setFormData({
                    name: customer.name,
                    email: customer.email
                });
            }
        }
    };

    useEffect(() => {
        const getUserAccess = () => {
            const userRole = sessionStorage.getItem('userrole') || '';
            fetch(`http://localhost:8000/roleaccess?role=${userRole}&menu=customer`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const userPermissions = data[0];
                        setPermissions({
                            canView: true,
                            canEdit: userPermissions.haveedit,
                            canAdd: userPermissions.haveadd,
                            canRemove: userPermissions.havedelete
                        });
                    } else {
                        navigate('/');
                        toast.warning('You are not authorized to access');
                    }
                });
        };

        getUserAccess();
        loadCustomers();
    }, [navigate]);

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h3>Customer Listing</h3>
                </div>
                <div className="card-body">
                    {permissions.canAdd && (
                        <>
                            <button 
                                onClick={() => setShowAddForm(!showAddForm)} 
                                className="btn btn-success mb-3"
                            >
                                {showAddForm ? 'Cancel' : 'Add (+)'}
                            </button>

                            {showAddForm && (
                                <div className="card p-3 mb-3">
                                    <h4>Add New Customer</h4>
                                    <div className="form-group mb-2">
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            name="name"
                                            placeholder="Enter Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group mb-2">
                                        <input 
                                            type="email" 
                                            className="form-control"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleAdd}
                                        className="btn btn-primary"
                                    >
                                        Save Customer
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {custlist.map(item => (
                                <tr key={item.id}>
                                    <td>{item.code}</td>
                                    <td>
                                        {editId === item.id ? (
                                            <input 
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        ) : item.name}
                                    </td>
                                    <td>
                                        {editId === item.id ? (
                                            <input 
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        ) : item.email}
                                    </td>
                                    <td>
                                        {permissions.canEdit && (
                                            <button 
                                                onClick={() => handleEdit(item)}
                                                className="btn btn-primary me-2"
                                            >
                                                {editId === item.id ? 'Save' : 'Edit'}
                                            </button>
                                        )}
                                        {permissions.canRemove && (
                                            <button 
                                                onClick={() => handleRemove(item.id)}
                                                className="btn btn-danger"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customer;
