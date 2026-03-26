import Container from "../components/Container";
import Title, { SmallTitle } from "../components/Title";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Legend, Bar } from 'recharts';
import { VehicleContext } from "../components/VehicleContext";
import { useMemo, useContext } from "react";

export default function Summary() {
    const { services, parts, activeVehicle } = useContext(VehicleContext);
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map(m => ({ name: m, cost: 0, parts: 0 }));
        if (!services || services.length === 0) return data;
        services.forEach(service => {
            const date = new Date(service.date);
            const year = date.getFullYear();
            const monthIdx = date.getMonth();

            data[monthIdx].cost += Number(service.labor_cost || 0);
            service.used_parts && Array.isArray(service.used_parts) && service.used_parts.forEach((part) => {
                const partInfo = parts.find(p => p.id === parseInt(part.part_id));
                console.log(part)
                //const quantity = service.used_parts.find(q => q.part_id === )
                
                data[monthIdx].parts += Number(partInfo.price)*Number(service.used_parts.quantity);

            })
            
        });
        return data;
    }, [services, parts, activeVehicle]);


    return (
        <Container>
            <Title>Summary</Title>
            <SmallTitle>Ide majd jönnek valami fancy adatok</SmallTitle>
            <BarChart 
                style={{width: '70%', aspectRatio: 1}}
                responsive
                data={chartData}
                margin={{top: 5, bottom: 5, left: 0, right: 0}}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey="cost" />
            <Tooltip />
            <Legend /> 
            <Bar dataKey="cost" fill="#0aa5c0" activeBar={{fill: '#34b9a3', stroke: '#03caa9'}} radius={[10, 10, 0, 0]} />
            <Bar dataKey="part" fill="#f80000" activeBar={{fill: '#34b9a3', stroke: 'green'}} radius={[10, 10, 0, 0]} />
            </BarChart>
        </Container>
    );
}