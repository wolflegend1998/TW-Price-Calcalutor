"""
Pricing Service — single source of truth, mirrors src/pricing.json logic exactly.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json, os, math

app = FastAPI(title="TW Pricing Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Mirror of src/pricing.json
DEVICE_TYPES = {
    "byo":                   {"name": "Bring Your Own Device",          "deviceCost": 0,  "monthlyAddOn": 0},
    "smartphone":            {"name": "Smartphone",                      "deviceCost": 0,  "monthlyAddOn": 0},
    "tablet_base":           {"name": "Tablet (Base)",                   "deviceCost": 50, "monthlyAddOn": 10},
    "tablet_5g":             {"name": "Tablet (5G)",                     "deviceCost": 60, "monthlyAddOn": 20},
    "fwa_addon":             {"name": "FWA/Home Internet (Add-on)",      "deviceCost": 0,  "monthlyAddOn": 35},
    "fwa_standalone":        {"name": "FWA/Home Internet (Standalone)",  "deviceCost": 0,  "monthlyAddOn": 60},
    "mobile_broadband_30":   {"name": "Mobile Broadband ($30)",          "deviceCost": 0,  "monthlyAddOn": 30},
    "mobile_broadband_40":   {"name": "Mobile Broadband ($40)",          "deviceCost": 0,  "monthlyAddOn": 40},
    "mobile_broadband_50":   {"name": "Mobile Broadband ($50)",          "deviceCost": 0,  "monthlyAddOn": 50},
}

PLANS = {
    "max_5g_byo": {"name": "Total MAX 5G BYO", "pricing": {"1":30,"2":30,"3":30,"4":30,"5plus":30},
                   "features": "Truly Unlimited 5G + UWB, 5Mbps hotspot, 100GB cloud, 140+ countries roaming, 6mo Disney+"},
    "starter":    {"name": "Total STARTER",     "pricing": {"1":40,"2":32.50,"3":30,"4":25,"5plus":30},
                   "features": "5G Nationwide, 10GB hotspot, Canada & Mexico roaming"},
    "max_5g":     {"name": "Total MAX 5G",      "pricing": {"1":55,"2":42.50,"3":33.33,"4":27.50,"5plus":30},
                   "features": "Truly Unlimited 5G + UWB, 5Mbps hotspot, 100GB cloud, 140+ countries roaming, 6mo Disney+"},
    "all_access": {"name": "Total ALL ACCESS",  "pricing": {"1":65,"2":47.50,"3":36.67,"4":30,"5plus":30},
                   "features": "Truly Unlimited 5G + UWB, 10Mbps hotspot, 1TB cloud, 140+ countries roaming, Disney+"},
}

AUTOPAY_DISCOUNT = 5.0
PROCESSING_FEE   = 29.99
TAX_RATE         = 0.08


class QuoteRequest(BaseModel):
    plan: str
    device_type: str = "smartphone"
    number_of_lines: str = "1"
    home_internet: bool = False
    auto_pay: bool = False
    include_taxes: bool = True


def _price_per_line(plan_key: str, lines_key: str) -> float:
    plan = PLANS.get(plan_key)
    if not plan:
        return 0.0
    return plan["pricing"].get(lines_key, plan["pricing"]["1"])


@app.get("/plans")
async def list_plans():
    return {"plans": PLANS, "deviceTypes": DEVICE_TYPES,
            "autoPayDiscount": AUTOPAY_DISCOUNT, "processingFee": PROCESSING_FEE}


@app.post("/quote")
async def get_quote(req: QuoteRequest):
    device = DEVICE_TYPES.get(req.device_type, DEVICE_TYPES["smartphone"])
    plan   = PLANS.get(req.plan)
    if not plan:
        return {"error": f"Unknown plan: {req.plan}"}

    num_lines  = 5 if req.number_of_lines == "5plus" else int(req.number_of_lines)
    lines_key  = req.number_of_lines if req.number_of_lines == "5plus" else req.number_of_lines
    ppl        = _price_per_line(req.plan, lines_key)

    lines_cost        = round(ppl * num_lines, 2)
    monthly_device    = device["monthlyAddOn"] * num_lines
    home_internet     = 35.0 if req.home_internet else 0.0
    autopay_discount  = AUTOPAY_DISCOUNT * num_lines if req.auto_pay else 0.0
    device_cost       = device["deviceCost"] * num_lines

    subtotal  = lines_cost + monthly_device + home_internet - autopay_discount
    taxes     = round(subtotal * TAX_RATE, 2) if req.include_taxes else 0.0
    monthly   = round(subtotal + taxes, 2)
    due_today = round(monthly + device_cost + PROCESSING_FEE, 2)

    return {
        "plan": plan["name"],
        "features": plan["features"],
        "lines": num_lines,
        "pricePerLine": ppl,
        "breakdown": {
            "linesCost": lines_cost,
            "deviceCost": device_cost,
            "monthlyDeviceAddOn": monthly_device,
            "homeInternetCost": home_internet,
            "autoPayDiscount": autopay_discount,
            "subtotal": round(subtotal, 2),
            "taxes": taxes,
            "processingFee": PROCESSING_FEE,
        },
        "monthlyPrice": monthly,
        "dueToday": due_today,
        "priceGuarantee": "5-year price guarantee included",
    }


@app.get("/health")
async def health():
    return {"status": "ok", "service": "pricing-service"}
