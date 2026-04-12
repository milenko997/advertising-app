export default function CategoryPicker({ categories, value, onChange, className }) {
    const parents = categories.filter(c => !c.parent_id);
    const childrenOf = {};
    categories.forEach(c => {
        if (c.parent_id) {
            if (!childrenOf[c.parent_id]) childrenOf[c.parent_id] = [];
            childrenOf[c.parent_id].push(c);
        }
    });
    const standalone = parents.filter(p => !childrenOf[p.id]);

    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={className ?? 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'}
        >
            <option value="">Select category</option>
            {parents.filter(p => childrenOf[p.id]?.length > 0).map(parent => (
                <optgroup key={parent.id} label={parent.name}>
                    {childrenOf[parent.id].map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </optgroup>
            ))}
            {standalone.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>
    );
}
