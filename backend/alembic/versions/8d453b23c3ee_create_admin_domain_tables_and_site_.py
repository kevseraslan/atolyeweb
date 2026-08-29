"""create admin domain tables and site settings

Revision ID: 8d453b23c3ee
Revises: b02040884ff1
Create Date: 2026-08-29 20:18:43.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8d453b23c3ee'
down_revision: Union[str, Sequence[str], None] = 'b02040884ff1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('admins',
    sa.Column('id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), sa.Identity(always=False), autoincrement=True, nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.Column('full_name', sa.String(length=100), nullable=False),
    sa.Column('role', sa.String(length=30), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_admins_email'), 'admins', ['email'], unique=True)

    op.create_table('site_settings',
    sa.Column('id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), sa.Identity(always=False), autoincrement=True, nullable=False),
    sa.Column('workshop_name', sa.String(length=150), nullable=False),
    sa.Column('phone', sa.String(length=30), nullable=True),
    sa.Column('whatsapp', sa.String(length=30), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=True),
    sa.Column('address', sa.Text(), nullable=True),
    sa.Column('working_hours', sa.String(length=150), nullable=True),
    sa.Column('google_maps_url', sa.String(length=500), nullable=True),
    sa.Column('instagram_url', sa.String(length=500), nullable=True),
    sa.Column('hero_title', sa.String(length=255), nullable=True),
    sa.Column('about_text', sa.Text(), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    op.create_table('order_admin_notes',
    sa.Column('id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), sa.Identity(always=False), autoincrement=True, nullable=False),
    sa.Column('order_id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), nullable=False),
    sa.Column('admin_id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), nullable=False),
    sa.Column('note', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['admin_id'], ['admins.id'], ondelete='RESTRICT'),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_admin_notes_admin_id'), 'order_admin_notes', ['admin_id'], unique=False)
    op.create_index(op.f('ix_order_admin_notes_order_id'), 'order_admin_notes', ['order_id'], unique=False)

    bind = op.get_bind()
    if bind.engine.name != 'sqlite':
        op.create_index(op.f('ix_order_status_history_changed_by_admin_id'), 'order_status_history', ['changed_by_admin_id'], unique=False)
        op.create_foreign_key('fk_order_status_history_changed_by_admin', 'order_status_history', 'admins', ['changed_by_admin_id'], ['id'], ondelete='SET NULL')


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    if bind.engine.name != 'sqlite':
        op.drop_constraint('fk_order_status_history_changed_by_admin', 'order_status_history', type_='foreignkey')
        op.drop_index(op.f('ix_order_status_history_changed_by_admin_id'), table_name='order_status_history')

    op.drop_table('order_admin_notes', if_exists=True)
    op.drop_table('site_settings', if_exists=True)
    op.drop_table('admins', if_exists=True)
