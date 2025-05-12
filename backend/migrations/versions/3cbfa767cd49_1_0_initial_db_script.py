"""1.0 Initial db script

Revision ID: 3cbfa767cd49
Revises: 
Create Date: 2025-04-14 16:42:44.424319

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3cbfa767cd49'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create all tables with proper relationships
    op.create_table('users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('last_name', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False, server_default='tenant'),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('phone_number', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('preference', sa.Text(), nullable=True),
        sa.Column('looking_for_roommate', sa.Boolean(), server_default='false'),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    op.create_table('apartments',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('landlord_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=False),
        sa.Column('apartment_number', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('state', sa.String(), nullable=False),
        sa.Column('zip_code', sa.String(), nullable=False),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('bedrooms', sa.Integer(), nullable=False),
        sa.Column('bathrooms', sa.Integer(), nullable=False),
        sa.Column('availability', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.Column('images', postgresql.ARRAY(sa.String()), nullable=True),
        sa.ForeignKeyConstraint(['landlord_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('applications',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('apartment_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), server_default='pending'),
        sa.Column('admin_notes', sa.String(), nullable=True),
        sa.Column('background_check_status', sa.String(), server_default='pending'),
        sa.Column('submitted_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('lease_duration', sa.Integer(), nullable=True),
        sa.Column('desired_move_in_date', sa.DateTime(), nullable=True),
        sa.Column('application_notes', sa.Text(), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['apartment_id'], ['apartments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tenant_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('maintenance_requests',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('apartment_id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('urgency', sa.String(), server_default='medium'),
        sa.Column('status', sa.String(), server_default='pending'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['apartment_id'], ['apartments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tenant_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('background_checks',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('apartment_id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), server_default='pending'),
        sa.Column('report_url', sa.String(), nullable=True),
        sa.Column('requested_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['apartment_id'], ['apartments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tenant_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for better query performance
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_apartments_landlord_id'), 'apartments', ['landlord_id'])
    op.create_index(op.f('ix_applications_tenant_id'), 'applications', ['tenant_id'])
    op.create_index(op.f('ix_applications_apartment_id'), 'applications', ['apartment_id'])

def downgrade():
    # Drop tables in reverse order
    op.drop_table('background_checks')
    op.drop_table('maintenance_requests')
    op.drop_table('applications')
    op.drop_table('apartments')
    op.drop_table('users')