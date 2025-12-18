// app/api/leases/route.js
import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Mock database
let leases = [
  {
    id: 'LEASE-001',
    propertyId: 'PROP-001',
    propertyTitle: 'Sunset Apartment #304',
    propertyAddress: '123 Beach Rd, Santa Monica, CA',
    tenantId: 'TEN-001',
    tenantName: 'Alex Johnson',
    tenantEmail: 'alex@example.com',
    landlordId: 'OWN-001',
    landlordName: 'John Smith',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    monthlyRent: 1200,
    securityDeposit: 1200,
    paymentDay: 1,
    paymentMethod: 'bank_transfer',
    utilitiesIncluded: ['water', 'electricity'],
    utilitiesTenantPaid: ['internet', 'cable'],
    occupants: ['Alex Johnson', 'Sarah Johnson'],
    noticeDays: 30,
    additionalTerms: '',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');
  
  let filteredLeases = [...leases];
  
  // Filter by role
  if (userRole === 'owner') {
    filteredLeases = leases.filter(l => l.landlordId === userId);
  } else if (userRole === 'tenant') {
    filteredLeases = leases.filter(l => l.tenantId === userId);
  }
  
  // Filter by status
  const status = searchParams.get('status');
  if (status && status !== 'all') {
    filteredLeases = filteredLeases.filter(l => l.status === status);
  }
  
  return NextResponse.json(filteredLeases);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { propertyId, tenantId, template = 'standard' } = body;
    
    // Generate new lease ID
    const newId = `LEASE-${Date.now().toString().slice(-6)}`;
    
    // Create lease from template
    const newLease = {
      id: newId,
      propertyId,
      propertyTitle: body.propertyTitle || 'New Property',
      propertyAddress: body.propertyAddress || '',
      tenantId,
      tenantName: body.tenantName || 'New Tenant',
      tenantEmail: body.tenantEmail || '',
      landlordId: body.landlordId,
      landlordName: body.landlordName || '',
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      monthlyRent: body.monthlyRent || 0,
      securityDeposit: body.securityDeposit || 0,
      paymentDay: body.paymentDay || 1,
      paymentMethod: body.paymentMethod || 'bank_transfer',
      utilitiesIncluded: body.utilitiesIncluded || ['water', 'electricity'],
      utilitiesTenantPaid: body.utilitiesTenantPaid || ['internet', 'cable'],
      occupants: body.occupants || [],
      noticeDays: body.noticeDays || 30,
      additionalTerms: body.additionalTerms || '',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      signatureProgress: 'draft',
      signedDate: null,
      landlordSignature: null,
      tenantSignature: null,
      ipAddress: null,
      timestamp: null,
    };
    
    leases.push(newLease);
    
    return NextResponse.json(newLease, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...updates } = await request.json();
    
    const index = leases.findIndex(l => l.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
    }
    
    leases[index] = {
      ...leases[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    return NextResponse.json(leases[index]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Generate PDF
export async function generateLeasePDF(lease) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  
  const { width, height } = page.getSize();
  const fontSize = 12;
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let y = height - 50;
  
  // Title
  page.drawText('RESIDENTIAL LEASE AGREEMENT', {
    x: 50,
    y,
    size: 20,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  y -= 30;
  
  // Date
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;
  
  // Property Section
  page.drawText('1. PROPERTY', {
    x: 50,
    y,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  y -= 20;
  
  page.drawText(`Address: ${lease.propertyAddress}`, {
    x: 60,
    y,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;
  
  // Add more sections...
  
  // Signatures
  y -= 40;
  page.drawText('LANDLORD SIGNATURE:', {
    x: 50,
    y,
    size: fontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  y -= 20;
  
  page.drawText(lease.landlordName || '', {
    x: 60,
    y,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;
  
  page.drawText('TENANT SIGNATURE:', {
    x: 50,
    y,
    size: fontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  y -= 20;
  
  page.drawText(lease.tenantName || '', {
    x: 60,
    y,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Download PDF endpoint
export async function GET_PDF(request) {
  const { searchParams } = new URL(request.url);
  const leaseId = searchParams.get('id');
  
  const lease = leases.find(l => l.id === leaseId);
  if (!lease) {
    return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
  }
  
  const pdfBytes = await generateLeasePDF(lease);
  
  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Lease-${leaseId}.pdf"`,
    },
  });
}