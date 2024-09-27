import React, { useState } from 'react';
import './index.css';

const GeneratorCalculator = () => {
    const [fuelType, setFuelType] = useState('gasoline');
    const [fuelAmount, setFuelAmount] = useState('');
    const [outlet, setOutlet] = useState('');
    const [appliances, setAppliances] = useState({
        fridge: false,
        tv: false,
        fan: false,
        microwave: false,
        coffeeMaker: false,
        toaster: false,
        dishwasher: false,
        washingMachine: false,
        dryer: false,
        computer: false,
        phoneCharger: false,
        router: false,
    });
    const [result, setResult] = useState('');

    const appliancePower = {
        fridge: 600, // Watts
        tv: 100,
        fan: 75,
        microwave: 1000,
        coffeeMaker: 800,
        toaster: 1200,
        dishwasher: 1500,
        washingMachine: 500,
        dryer: 3000,
        computer: 150,
        phoneCharger: 10,
        router: 10,
    };

    const outletLimits = {
        "1": { maxAmps: 20, voltage: 120 }, // 120V, 20A GFCI
        "2": { maxAmps: 30, voltage: 120 }, // 120V, 30A Twist Lock
        "3": { maxAmps: 30, voltage: 240 }, // 120/240V, 30A Twist Lock
        "4": { maxAmps: 31.25, voltage: 240 } // 120/240V, 50A
    };

    const handleApplianceChange = (e) => {
        const { name, checked } = e.target;
        setAppliances({ ...appliances, [name]: checked });
    };

    const calculateFuelDuration = () => {
        if (!fuelAmount || !outlet) {
            setResult('Please enter fuel amount and select an outlet.');
            return;
        }

        const selectedFuelRate = fuelType === 'gasoline' ? 7500 : 6750;
        let totalLoad = 0;

        // Calculate total power consumption of selected appliances
        for (const appliance in appliances) {
            if (appliances[appliance]) {
                totalLoad += appliancePower[appliance];
            }
        }

        if (totalLoad === 0) {
            setResult('Please select at least one appliance.');
            return;
        }

        // Check if the load is safe for the selected outlet
        const maxWatts = outletLimits[outlet].maxAmps * outletLimits[outlet].voltage;
        if (totalLoad > maxWatts) {
            setResult(`The total load of ${totalLoad}W exceeds the maximum capacity of ${maxWatts}W for the selected outlet.`);
            return;
        }

        // Calculate fuel duration
        const availablePower = fuelAmount * selectedFuelRate;
        const hours = availablePower / totalLoad;

        setResult(`The generator will run for approximately ${hours.toFixed(2)} hours with the selected load.`);
    };

    return (
        <div className="calculator">
            <h2>Generator Fuel Duration Calculator</h2>
            <form>
                <div>
                    <label>Fuel Type:</label>
                    <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                        <option value="gasoline">Gasoline</option>
                        <option value="lpg">LPG</option>
                    </select>
                </div>

                <div>
                    <label>Fuel Amount (gallons):</label>
                    <input
                        type="number"
                        value={fuelAmount}
                        onChange={(e) => setFuelAmount(e.target.value)}
                        step="0.1"
                    />
                </div>

                <div>
                    <label>Outlet:</label>
                    <select value={outlet} onChange={(e) => setOutlet(e.target.value)}>
                        <option value="">Select Outlet</option>
                        <option value="1">120V, 20A Duplex GFCI (NEMA 5-20R)</option>
                        <option value="2">120V, 30A Twist Lock (NEMA L5-30R)</option>
                        <option value="3">120/240V, 30A Twist Lock (NEMA L14-30R)</option>
                        <option value="4">120/240V, 50A (NEMA 14-50R)</option>
                    </select>
                </div>

                <div>
                    <label>Select Appliances:</label><br />
                    <input
                        type="checkbox"
                        name="fridge"
                        checked={appliances.fridge}
                        onChange={handleApplianceChange}
                    /> Refrigerator (600W)<br />
                    <input
                        type="checkbox"
                        name="tv"
                        checked={appliances.tv}
                        onChange={handleApplianceChange}
                    /> TV (100W)<br />
                    <input
                        type="checkbox"
                        name="fan"
                        checked={appliances.fan}
                        onChange={handleApplianceChange}
                    /> Fan (75W)<br />
                    <input
                        type="checkbox"
                        name="microwave"
                        checked={appliances.microwave}
                        onChange={handleApplianceChange}
                    /> Microwave (1000W)<br />
                    <input
                        type="checkbox"
                        name="coffeeMaker"
                        checked={appliances.coffeeMaker}
                        onChange={handleApplianceChange}
                    /> Coffee Maker (800W)<br />
                    <input
                        type="checkbox"
                        name="toaster"
                        checked={appliances.toaster}
                        onChange={handleApplianceChange}
                    /> Toaster (1200W)<br />
                    <input
                        type="checkbox"
                        name="dishwasher"
                        checked={appliances.dishwasher}
                        onChange={handleApplianceChange}
                    /> Dishwasher (1500W)<br />
                    <input
                        type="checkbox"
                        name="washingMachine"
                        checked={appliances.washingMachine}
                        onChange={handleApplianceChange}
                    /> Washing Machine (500W)<br />
                    <input
                        type="checkbox"
                        name="dryer"
                        checked={appliances.dryer}
                        onChange={handleApplianceChange}
                    /> Dryer (3000W)<br />
                    <input
                        type="checkbox"
                        name="computer"
                        checked={appliances.computer}
                        onChange={handleApplianceChange}
                    /> Computer (150W)<br />
                    <input
                        type="checkbox"
                        name="phoneCharger"
                        checked={appliances.phoneCharger}
                        onChange={handleApplianceChange}
                    /> Phone Charger (10W)<br />
                    <input
                        type="checkbox"
                        name="router"
                        checked={appliances.router}
                        onChange={handleApplianceChange}
                    /> Router (10W)<br />
                </div>

                <button type="button" onClick={calculateFuelDuration}>Calculate</button>
            </form>
            {result && <div className="result">{result}</div>}
        </div>
    );
};

export default GeneratorCalculator;
